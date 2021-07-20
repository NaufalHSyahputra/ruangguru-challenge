package requests

import "github.com/gookit/validate"

type UpdateRedeemForm struct {
	Status string `json:"status" xml:"status" validate:"required"`
}

// Messages you can custom validator error messages.
func (f UpdateRedeemForm) Messages() map[string]string {
	return validate.MS{
		"required": "{field} wajib diisi.",
	}
}

// Translates you can custom field translates.
func (f UpdateRedeemForm) Translates() map[string]string {
	return validate.MS{
		"Status": "Status",
	}
}
