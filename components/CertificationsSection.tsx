export default function CertificationsSection() {

  return (

    <section
      id="certifications"
      className="px-8 md:px-24 lg:px-40 py-10"
    >

      <h2 className="text-4xl font-bold">

        Certifications & Learning

      </h2>


      <div className="grid md:grid-cols-2 gap-6 mt-10">


        <div className="border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition">

          <h3 className="text-xl">

            TryHackMe Cyber Security 101

          </h3>


          <p className="mt-3 text-gray-400">

            Completed beginner cybersecurity pathway covering
            networking, Linux, web security fundamentals and
            security concepts.

          </p>

        </div>




        <div className="border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition">

          <h3 className="text-xl">

            Cisco Foundations of Cybersecurity

          </h3>


          <p className="mt-3 text-gray-400">

            Completed foundational cybersecurity training covering
            core cybersecurity concepts and principles.

          </p>

        </div>



      </div>


    </section>

  );

}