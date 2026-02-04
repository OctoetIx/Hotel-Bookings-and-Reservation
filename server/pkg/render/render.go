package render

import (
	"bytes"
	"fmt"
	"html/template"
	"net/http"
	"path/filepath"
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/config"
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/models"
)

var functions = template.FuncMap{
	// "upper": strings.ToUpper,
}

var app *config.AppConfig

func NewTemplates(a *config.AppConfig) {
	app = a
}

func CreateTemplateCache() (map[string]*template.Template, error) {
	myCache := map[string]*template.Template{}

	// Find all page templates
	pages, err := filepath.Glob("../../templates/*.page.tmpl")
	if err != nil {
		return myCache, err
	}

	for _, page := range pages {
		name := filepath.Base(page)

		// Create template set with functions
		ts, err := template.New(name).
			Funcs(functions).
			ParseFiles(page)
		if err != nil {
			return myCache, err
		}

		// Add layouts if they exist
		layouts, err := filepath.Glob("../../templates/*.layout.tmpl")
		if err != nil {
			return myCache, err
		}

		if len(layouts) > 0 {
			ts, err = ts.ParseGlob("../../templates/*.layout.tmpl")
			if err != nil {
				return myCache, err
			}
		}

		myCache[name] = ts
	}

	return myCache, nil
}

func AddDefaultData(td *models.TemplateData) *models.TemplateData {
	return td
}

func RenderTemplate(w http.ResponseWriter, tmpl string, td*models.TemplateData) {

	var tc  map[string]*template.Template
	if app.UseCache {
		tc = app.TemplateCache
	} else {
		tc, _ = CreateTemplateCache()
	}
	t, ok := tc[tmpl]
	if !ok {
		fmt.Println("Template not found in cache:", tmpl)
		http.Error(w, "Internal Server Error", 500)
		return
	}
	buf := new(bytes.Buffer)
	td = AddDefaultData(td)
	_ = t.Execute(buf, td)
	_, err := buf.WriteTo(w)
	if err != nil {
		fmt.Println("Error writing template to browser:", err)
		http.Error(w, "Internal Server Error", 500)
	}
}
