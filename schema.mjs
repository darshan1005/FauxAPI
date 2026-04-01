import { defineMock, string, number, email } from './dist/index.js';

export default defineMock({
  id: number,
  name: string,
  email: email,
});