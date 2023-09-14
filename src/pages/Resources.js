import React, {useState} from 'react';
import { AiOutlineArrowDown } from 'react-icons/ai';
const Resources = (props) => {

  const sections = {
    "Enrollment":  [{
      title: "Handbook",
      link: "https://www.dvc.edu/international/resources/handbook2022.pdf",
    },
    {
      title: "General Steps",
      link: "https://www.dvc.edu/future/steps/international.html",
    },
    {
      title: "General Requirements",
      link: "https://www.dvc.edu/international/apply/index.html",
    },
    {
      title: "Education Info",
      link: "https://educationusa.state.gov/",
    },
    {
      title: "Tuition and Insurance Payment Instructions",
      link: "https://www.dvc.edu/international/resources/tuition.html",
    },
    {
      title: "Health Insurance",
      link: "https://www.dvc.edu/international/resources/insurance.html",
    }],
    "After Acceptance": [
    {
        title: "After Being Accepted",
        link: "https://www.dvc.edu/international/after/index.html",
    },
    {
        title: "Matriculation",
        link: "https://www.dvc.edu/international/after/assessment-orientation.html",
    },
    {
        title: "Employment",
        link: "https://www.dvc.edu/international/jobs.html",
    },
    {
        title: "Transferring",
        link: "https://www.dvc.edu/international/after/transfer-procedures.html",
    },
    {
        title: "Foreign Travelling",
        link: "https://www.dvc.edu/international/after/travel-outside-us.html",
    }],
    "Immigration": [
    {
        title: "F1 Visa Process",
        link: "https://www.dvc.edu/international/apply/visa-application-process/index.html",
    },
    {
        title: "Information on Visas for International Students",
        link: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html",
    },
    {
        title: "Additional Student Visa Resource",
        link: "https://educationusa.state.gov/your-5-steps-us-study/apply-your-student-visa",
    },
    {
        title: "Visa Denials",
        link: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/visa-denials.html",
    },
    {
        title: "U.S Worldwide Embassies and Consulates",
        link: "https://www.usembassy.gov/",
    },
    {
        title: "California Embassies and Consulates",
        link: "https://www.dvc.edu/international/resources/embassies.html",
    },
    {
        title: "SEVIS Fee",
        link: "https://www.dvc.edu/international/apply/visa-application-process/sevis-fee.html",
    }],
    "Housing": [
    {
        title: "General Housing",
        link: "https://www.dvc.edu/international/resources/housing.html",
    },
    {
        title: "Address Changes",
        link: "https://www.dvc.edu/international/after/change-of-address.html",
    },
    {
        title: "Homestays",
        link: "https://www.dvc.edu/international/resources/homestay.html",
    },
    {
        title: "4Stay",
        link: "https://4cdhousing.4stay.com/",
    },
    {
        title: "Apartment and Townhouse Information",
        link: "https://www.dvc.edu/international/resources/apartments.html",
    },
    {
        title: "Furniture Rental Packages (Cort)",
        link: "https://www.cort.com/furniture-rental/furniture-packages/student",
    },
    {
        title: "Hotels",
        link: "https://www.dvc.edu/international/resources/hotels.html",
    }],
    "FAQ": [
    {
        title: "F-1 Student Frequently Asked Questions",
        link: "https://www.dvc.edu/international/faq.html",
    }]
}
  const initialOpenStates = Object.keys(sections).reduce((acc, sectionName) => {
    acc[sectionName] = false;
    return acc;
  }, {});
  
  
  const [openSections, setOpenSections] = useState(initialOpenStates);
  
  const toggleSection = (sectionName) => {
    setOpenSections(prevState => ({
      ...prevState,
      [sectionName]: !prevState[sectionName]
    }));
};

  
  return(
  <div className="md:w-8/12 w-11/12 lg:my-12 my-6 mx-auto shadow-xl rounded-xl bg-white">
  <div className="w-full flex justify-center mb-6 flex-col">
    <h2 className="mx-auto w-fit md:text-xl xs:text-lg text-sm font-semibold text-gray-800 md:my-4 my-2 capitalize">
      {props.t("Resources")}
    </h2>
    <div className="p-5 w-9/12 mx-auto">

      {Object.keys(sections).map(sectionName => (
        <div key={sectionName} className="mb-6">
          <h2 
            className="flex justify-between text-lg font-semibold text-green-800 opacity-80 hover:opacity-100 duration-100 cursor-pointer mb-2" 
            onClick={() => toggleSection(sectionName)}>
            {props.t(sectionName)}
            <AiOutlineArrowDown className="duration-200" style={displayArrowDirection(sectionName)}/>
          </h2>
          {openSections[sectionName] && (
            <ul>
              {sections[sectionName].map((resource, index) => (
                <li className="md:ml-4 ml-2 my-2">
                  <a href={resource.link} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900 hover:underline">• {props.t(resource.title)}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </div>
</div>
  )
function displayArrowDirection(sectionName) {
  return openSections[sectionName] ? { transform: 'rotate(180deg)' } : {};
}

}

export default Resources