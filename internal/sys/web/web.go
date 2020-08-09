package web

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/pkg/errors"
)

// HTTPError is used to denote an application error that could
// return a NON-500 status code. The code field of the AppError is
// used to denote the status code. Currently any mq.QError is
// treated as an application error, therefore, returning a 500
// status code. In the future some of the the mq.Error.Code(s)
// could be mapped to a specific http response status code.
type HTTPError struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
}

// ErrInternalServer represents a 500 application errors.
var ErrInternalServer = HTTPError{Code: http.StatusInternalServerError, Message: "internal server error"}

// NewHTTPErr creates a new app error for a status code and message.
func NewHTTPErr(code int, message string) *HTTPError {
	return &HTTPError{Code: code, Message: message}
}

// Error returns the error's message.
func (a *HTTPError) Error() string {
	return a.Message
}

// Response is the format used for all the responses.
type Response struct {
	Errors  []HTTPError `json:"errors"`
	Results interface{} `json:"results"`
}

// writeResponse marshals the response to json and writes it
// to the response writer.
func writeResponse(w http.ResponseWriter, r *Response, code int) {
	if code == http.StatusNoContent || r == nil {
		w.WriteHeader(code)
		return
	}

	// Marshal the data into a JSON string.
	jsonData, err := json.Marshal(r)
	if err != nil {
		log.Printf("Request Error: marshaling response, %+v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(jsonData)
}

// RespondError creates the response for an error. It should be used
// to respond with an error.
func RespondError(w http.ResponseWriter, err error) {
	log.Printf("Request Error: %+v", err)

	if e, ok := errors.Cause(err).(*HTTPError); ok {
		r := Response{
			Errors: []HTTPError{
				{
					Message: e.Message,
				},
			},
		}

		writeResponse(w, &r, e.Code)
		return
	}

	// Return Internal Server error.
	resp := Response{
		Errors: []HTTPError{ErrInternalServer},
	}
	writeResponse(w, &resp, http.StatusInternalServerError)
}

// Respond creates a successful response with the data provided.
func Respond(w http.ResponseWriter, data interface{}, code int) {
	r := Response{
		Results: data,
	}
	writeResponse(w, &r, code)
}
