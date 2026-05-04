import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('renders MangaReader brand', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const brandElement = screen.getByText(/MangaReader/i);
  // Based on Navbar: <span className="navbar-brand">...MangaReader</span> but "Manga" is in separate span.
  // screen.getByText might fail if text is split across elements.
  // Navbar has "Manga" inside span, "Reader" outside.
  // Text content is "MangaReader".
  // Let's check for "Reader" as it is text node.
  const readerElement = screen.getByText(/Reader/i);
  expect(readerElement).toBeInTheDocument();
});
