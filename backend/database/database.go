package database

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"InHouseHub/config"
	"InHouseHub/model"
)

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
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(config.Get("DATABASE_URL")))

	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to MongoDB")
	db.Client = client
}

func (db *Database) CreateCollection(collection string) {
	db.Client.Database(config.Get("DATABASE_NAME")).CreateCollection(context.Background(), collection)
}

func (db *Database) GetCollection(collection string) *mongo.Collection {
	return db.Client.Database(config.Get("DATABASE_NAME")).Collection(collection)
}

func (db *Database) CreateUser(user model.User) (string, error) {
	result, err := db.UserCollection.InsertOne(context.Background(), user)
	if err != nil {
		return "", err
	}

	// Verifica primero que el tipo de InsertedID sea el esperado
	oid, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		return "", fmt.Errorf("expected ObjectID, got %T", result.InsertedID)
	}

	// Convierte ObjectID a string
	return oid.Hex(), nil
}

func (db *Database) GetUserByEmail(email string) (model.User, error) {
	var user model.User
	err := db.UserCollection.FindOne(context.Background(), bson.M{"email": email}).Decode(&user)
	if err != nil {
		return user, err
	}

	return user, nil
}
