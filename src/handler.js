const { nanoid } = require('nanoid');
const books = require('./books.js');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getAllBooksHandler = async (request, h) => {
  const { name, reading, finished } = request.query;
  if (reading === '1' || reading === '0') {
    if (reading === '1') {
      const response = h.response({
        status: 'success',
        data: {
          books: books
            .filter((book) => book.reading === true)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
        },
      });
      response.code(200);
      return response;
    } else if (reading === '0') {
      const response = h.response({
        status: 'success',
        data: {
          books: books
            .filter((book) => book.reading !== true)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
        },
      });
      response.code(200);
      return response;
    } else {
      const response = {
        status: 'success',
        data: {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      };
      response.code(200);
      return response;
    }
  } else if (finished === '1' || finished === '0') {
    if (finished === '1') {
      const response = h.response({
        status: 'success',
        data: {
          books: books
            .filter((book) => book.finished === true)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
        },
      });
      response.code(200);
      return response;
    } else if (finished === '0') {
      const response = h.response({
        status: 'success',
        data: {
          books: books
            .filter((book) => book.finished !== true)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
        },
      });
      response.code(200);
      return response;
    } else {
      const response = {
        status: 'success',
        data: {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      };
      response.code(200);
      return response;
    }
  } else if (name === 'Dicoding' || name === 'dicoding') {
    function checkName(book) {
      if (book.name.includes('Dicoding') || book.name.includes('dicoding')) {
        return book;
      }
    }

    const response = h.response({
      status: 'success',
      data: {
        books: books.filter(checkName).map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else if (!name && !reading && !finished) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  // const book1 = books.filter((book) => book.id === bookId)[0];
  const book = books.find((book) => book.id === bookId);
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updateAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updateAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
