#Proto-Quote#

A prototype of a web-based invoicing app.

Built with JS, Bootstrap and ReactJS for components.

Build an invoice/quote by creating sections and sub-sections against which
one can add quote items. Allow for over-riding of markup values on each item
or inherit from a global config.

Still to implement a NodeJS back-end with MongoDB for persisting of quotes.
Still to implement SQL DB for user account management.

Important files:
1. src/quoting/quote-system.js - All business logic around the logical
representation of the quotes. Should be used on the front end and back end
so that all mathematical logic is common
2. src/quoting/quote-system-ui.js - All the specifics for the ReactJS components
