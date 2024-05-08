package internal

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const DatabaseUrl = "mongodb://localhost:27017"
const DatabaseName = "InHouseHub"

type Database struct {
	client *mongo.Client
}

func (db *Database) Connect() {
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(DatabaseUrl))
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to MongoDB")
	db.client = client
}
