const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');
const Books = require('../models/book');
const bookAPI = require('../apis/bookAPI');

describe('books routes', () => {
    // Setup the DB connection (and teardown)
    beforeAll(testUtils.connectDB);
    afterAll(async () => {
        await testUtils.clearDB();
        await testUtils.stopDB();
    });

    describe('POST /books', () => {
        // TEST SUITE:
        // Insert a book w/a predefined title and author
        // Call the POST /books route
        // Check for 409
        // Check the DB
        it('should return a 409 when inserting a duplicate book', async () => {
            const title = 'A Tale of Two Cities';
            const author = 'Charles Dickens';
            const book = {
                title,
                author,
                pageCount: 400,
                publicationYear: 1859
            };
            await Books.insertMany([book]);

            const response = await request(server)
                .post('/books')
                .send(book);
            
            expect(response.status).toEqual(409);
            expect(response.text).toEqual('Conflict');

            const books = await Books.find();
            expect(books).toHaveLength(1);
        });
    });

    describe('GET /books/:id/ISBN', () => {
        let bookApiSpy;
        beforeEach(() => {
            bookApiSpy = jest.spyOn(bookAPI, 'getISBN');
        });

        afterEach(() => {
            bookApiSpy.mockRestore();
        })

        it('should return an ISBN for a book', async () => {
            bookApiSpy.mockResolvedValueOnce('isbn-number').mockResolvedValueOnce('2');

            const book = {
                title: 'Accidentally on Purpose',
                author: 'Kristen Kish',
                pageCount: 400,
                publicationYear: 2025
            };
            const [insertedBook] = await Books.insertMany([book]);
            const id = insertedBook._id.toString();

            const response = await request(server)
                .get(`/books/${id}/ISBN`);
            
            expect(response.status).toEqual(200);
            expect(response.body).toEqual({'ISBN': 'isbn-number'});
            expect(bookApiSpy).toHaveBeenCalledWith('Accidentally on Purpose', 'Kristen Kish');

            const response2 = await request(server)
                .get(`/books/${id}/ISBN`);
            
            expect(response2.status).toEqual(200);
            expect(response2.body).toEqual({'ISBN': '2'});
        });
    });
});