package internal

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"InHouseHub/internal/model"
)

const DatabaseUrl = "mongodb://localhost:27017"
const DatabaseName = "InHouseHub"

type Database struct {
	Client *mongo.Client

	// collections
	UserCollection *mongo.Collection
}

func StartDatabase() *Database {
	db := &Database{}
	db.Connect()

	// Initialize collections
	db.CreateCollection("users")
	db.UserCollection = db.GetCollection("users")

	return db
}

func (db *Database) Connect() {
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(DatabaseUrl))
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to MongoDB")
	db.Client = client
}

func (db *Database) CreateCollection(collection string) {
	db.Client.Database(DatabaseName).CreateCollection(context.Background(), collection)
}

func (db *Database) GetCollection(collection string) *mongo.Collection {
	return db.Client.Database(DatabaseName).Collection(collection)
}

func (db *Database) CreateUser(user model.User) error {
	_, err := db.UserCollection.InsertOne(context.Background(), user)
	return err
}
