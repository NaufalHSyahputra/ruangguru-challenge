package requests

import "github.com/gookit/validate"

type RedeemForm struct {
	CustId            string `json:"custid" xml:"custid" validate:"required"`
	CustName          string `json:"custname" xml:"custname" validate:"required"`
	CustAddress       string `json:"custaddress" xml:"custaddress" validate:"required"`
	CustContactPerson string `json:"custcp" xml:"custcp" validate:"required"`
	Prize             string `json:"prize" xml:"prize" validate:"required"`
}

// Messages you can custom validator error messages.
func (f RedeemForm) Messages() map[string]string {
	return validate.MS{
		"required": "{field} wajib diisi.",
	}
}

// Translates you can custom field translates.
func (f RedeemForm) Translates() map[string]string {
	return validate.MS{
		"CustId":            "Customer ID",
		"CustName":          "User Name",
		"CustAddress":       "User Address",
		"CustContactPerson": "User Contact Person",
		"Prize":             "Prize",
	}
}
