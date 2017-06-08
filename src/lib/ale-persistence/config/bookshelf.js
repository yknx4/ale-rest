import getBookshelf from 'bookshelf';
import bookshelfModel from 'bookshelf-modelbase';

function initBookshelf(knex) {
  const bookshelf = getBookshelf(knex);
  const Model = bookshelfModel(bookshelf);

  bookshelf.plugin('pagination');
  bookshelf.plugin('registry');

  return {
    bookshelf,
    Model,
  };
}

export default initBookshelf;
