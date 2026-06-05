export default function ProjectsSection() {

  const projects = [

    {
      title: "🌐 Syed Nexus Portfolio",
      desc:
        "Personal portfolio project created to learn modern web development and deployment workflows.",
      points: [
        "Next.js application",
        "Git and GitHub version control",
        "Vercel deployment",
        "Cloudflare DNS configuration"
      ]
    },


    {
      title: "🔐 Cybersecurity Learning Labs",
      desc:
        "Hands-on learning environment for practicing cybersecurity concepts and tools.",
      points: [
        "Linux fundamentals",
        "Networking practice",
        "Web security basics",
        "Security tools exploration"
      ]
    },


    {
      title: "🖥 Nexus Lab (In Progress)",
      desc:
        "Personal infrastructure learning project focused on servers, networking and self-hosting.",
      points: [
        "Home server planning",
        "Virtualization learning",
        "Docker fundamentals",
        "Security monitoring concepts"
      ]
    }

  ];


  return (

    <section
      id="projects"
      className="px-8 md:px-24 lg:px-40 py-10"
    >


      <h2 className="text-4xl font-bold">

        Projects

      </h2>



      <div className="grid md:grid-cols-3 gap-6 mt-10">


        {projects.map((project)=>(

          <div
            key={project.title}
            className="
            border border-slate-700/60 bg-slate-900/50
            rounded-xl
            p-6
            hover:border-blue-500
            transition
            "
          >


            <h3 className="text-xl">

              {project.title}

            </h3>


            <p className="mt-3 text-gray-400">

              {project.desc}

            </p>



            <ul className="mt-5 space-y-2 text-gray-400">


              {project.points.map(point=>(

                <li key={point}>

                  • {point}

                </li>

              ))}


            </ul>


          </div>

        ))}


      </div>


    </section>

  );

}