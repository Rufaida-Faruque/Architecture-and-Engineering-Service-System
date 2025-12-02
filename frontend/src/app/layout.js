export default function Layout({ children }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <header>
        <h1>MERN Group Project</h1>
      </header>
      <main>{children}</main>
      <footer>© 2025 Team Project</footer>
    </div>
  );
}

