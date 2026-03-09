import React from 'react';

function App() {
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-800 flex flex-col items-center justify-center h-screen text-center text-white">
        <h1 className="text-6xl font-bold mb-4">מוסך רונן</h1>
        <h2 className="text-2xl mb-2">המוסך הכי טוב במדינה מספק שירות 24/7 לכל בעיה</h2>
        <p className="text-xl">100 מוסכניקים מומחים וצוות שזמין תמיד</p>
      </section>

      {/* About Section */}
      <section className="bg-gray-100 flex flex-row items-center p-8">
        <div className="w-1/2">
          <img src="/path-to-image.jpg" alt="About מוסך רונן" className="w-full h-auto" />
        </div>
        <div className="w-1/2 text-gray-900">
          <p>מוסך רונן הוא המוסך הכי טוב במדינה, מספק שירות 24/7 לכל בעיה עם צוות של 100 מוסכניקים מומחים.</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white grid grid-cols-1 md:grid-cols-2 gap-4 p-8 text-gray-900">
        <h2 className="text-3xl font-bold mb-4">השירותים שלנו</h2>
        <ul className="list-disc pl-5">
          <li>מתנקים כל דבר אפשרי ברכב</li>
          {/* Add more services as needed */}
        </ul>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-800 flex flex-col items-center justify-center p-8 text-white">
        <p className="text-2xl mb-4">צרו קשר עכשיו לקבלת שירות מקצועי!</p>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
          התקשרו עכשיו
        </button>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 flex flex-col items-center p-4 text-gray-100">
        <p>טלפון: [הכנס מספר טלפון כאן]</p>
        <p>מוסך רונן</p>
      </footer>
    </div>
  );
}

export default App;
