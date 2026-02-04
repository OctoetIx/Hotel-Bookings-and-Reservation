package handlers

import (
	"net/http"

	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/config"
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/models"
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/render"
)

// Hold data sent to templates

var Repo *Repository

type Repository struct {
	App *config.AppConfig
}

func NewRepo(a *config.AppConfig) *Repository {
	return &Repository{
		App: a,
	}
}

func NewHandlers(r *Repository) {
	Repo = r
}

func (m *Repository) Home(w http.ResponseWriter, r *http.Request) {

	remoteIP := r.RemoteAddr
	m.App.Session.Put(r.Context(), "remote_ip", remoteIP)

	stringMap := map[string]string{
		"test": "Hello, world this is the test for home page.",
	}
	render.RenderTemplate(w, "home.page.tmpl", &models.TemplateData{
		StringMap: stringMap,
	})
}

func (m *Repository) About(w http.ResponseWriter, r *http.Request) {

	stringMap := map[string]string{
		"test": "Hello, again.",
	}

	remoteIp := m.App.Session.GetString(r.Context(), "remote_ip")
	stringMap["remote_ip"] = remoteIp

	render.RenderTemplate(w, "about.page.tmpl", &models.TemplateData{
		StringMap: stringMap,
	})
}
