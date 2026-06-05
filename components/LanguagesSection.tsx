export default function LanguagesSection() {

  return (

    <section
      id="languages"
      className="px-8 md:px-24 lg:px-40 py-16"
    >


      <h2 className="text-3xl font-bold">

        Languages & Technical Exposure

      </h2>


      <div className="grid md:grid-cols-2 gap-6 mt-8">


        <div className="
        border border-gray-800
        rounded-xl
        p-6
        hover:border-blue-500
        transition
        ">

          <h3 className="text-xl">
            Spoken Languages
          </h3>


          <ul className="mt-5 space-y-3 text-gray-400">

            <li>• English — Professional working proficiency</li>

            <li>• Hindi — Fluent</li>

            <li>• Urdu — Fluent</li>

          </ul>


        </div>



        <div className="
        border border-gray-800
        rounded-xl
        p-6
        hover:border-blue-500
        transition
        ">


          <h3 className="text-xl">

            Programming & Scripting Exposure

          </h3>


          <p className="mt-4 text-gray-400">

            Languages and technologies explored through
            coursework, labs and personal projects.

          </p>


          <ul className="mt-5 space-y-3 text-gray-400">

            <li>• Python — Fundamentals</li>

            <li>• HTML & CSS — Fundamentals</li>

            <li>• JavaScript / TypeScript — Learning</li>

            <li>• Ruby — Basic exposure</li>

          </ul>


        </div>


      </div>


    </section>

  );

}