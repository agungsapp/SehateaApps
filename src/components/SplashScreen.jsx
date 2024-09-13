import logo from '../assets/logo.png';

const SplashScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-800 bg-radial-custom">
      {/* Logo */}
      <img
        src={logo} // Menggunakan import logo
        alt="App Logo"
        className="w-24 h-24 mb-4 animate-bounce" // Animasi bounce
      />

      {/* Nama besar */}
      <h1 className="text-4xl font-bold text-white mb-2 tracking-widest">
        Sehatea App
      </h1>

      {/* Slogan kecil */}
      <p className="text-lg text-gray-200 italic">
        Es teh paling canggih
      </p>
      {/* hak cipta kecil */}
      <p className="text-sm text-center mt-16 text-gray-200">
        Dibuat dengan <span className="text-lg">☕</span> oleh <span className="italic font-semibold">Agung Saputra</span>.
        <br />
      </p>
      <div className='absolute bottom-5 text-sm text-center  text-gray-200'>
        <span className="font-semibold ">Sanca Developer</span> &copy; 2024. All Rights Reserved.
      </div>

    </div>
  );
};

export default SplashScreen;
