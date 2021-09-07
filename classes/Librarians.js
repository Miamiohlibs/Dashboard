module.exports = class Librarians {
  constructor(librarians) {
    this.librarians = librarians;
  }

  getEmails() {
    return this.librarians.map((i) => i.email);
  }

  getLibrarianByEmail(email) {
    return this.librarians.filter((i) => i.email == email)[0];
  }

  getSubjectsByEmail(email) {
    let user = this.getLibrarianByEmail(email);
    if (user !== undefined && user.hasOwnProperty('subjects')) {
      return user.subjects.map((i) => i.name);
    }
    return [];
  }
};
