const Footer = () => {
  return (
    <footer className="bg-primary-800 text-primary-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">tiny health</h3>
            <p className="text-sm mt-2">keeping your tiny friends healthy</p>
          </div>
          <div className="text-sm">
            <p>&copy; {new Date().getFullYear()} tiny health</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;