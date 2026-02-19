package config

import (
	"fmt"
	"log"
	"os"
	

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google")



func OAuthConfig() { 
	config := &oauth2.Config{
		ClientID:  os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:      google.Endpoint,				
	}

	url := config.AuthCodeURL("state")
	fmt.Printf("Visit the URL for the auth dialog %v", url)

	tok, err:=config.Exchange(oauth.NoContext, "authorization-code")
	if err != nil {
		log.Fatal("Unable to retrieve token from web: ", err)
	}
	client := config.Client(oauth.NoContext, tok)
	client.Get(" ...")
}