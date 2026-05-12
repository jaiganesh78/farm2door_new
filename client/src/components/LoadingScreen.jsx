const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
      <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-medium animate-pulse">Loading Farm2Door...</p>
    </div>
  );
};

export default LoadingScreen;
