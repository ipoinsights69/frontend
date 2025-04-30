import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import aboutData from '@/app/data/about.json';
// Define TypeScript interfaces for the about data
interface MissionValue {
  title: string;
  icon: string;
  description: string;
}

interface Mission {
  statement: string;
  values: MissionValue[];
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
  };
}

interface ApproachItem {
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  title: string;
  quote: string;
}

interface AboutData {
  story: string[];
  mission: Mission;
  team: TeamMember[];
  approach: ApproachItem[];
  testimonials: Testimonial[];
}

// Type assertion for imported JSON data
const typedAboutData = aboutData as AboutData;

// Enable ISR with a revalidation time of 1 day (rarely changing content)
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'About Us | IPO Insight',
  description: 'Learn about IPO Insight - who we are, our mission, and the team behind India\'s most comprehensive IPO tracking and analysis platform.',
};

export default function AboutPage() {
  return (
    <main className="bg-gray-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-800">About IPO Insight</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              India's most comprehensive platform for IPO tracking, analysis, and insights.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Our Story */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Story</h2>
            <div className="bg-white border border-gray-200 rounded-md p-6">
              <div className="prose max-w-none text-gray-600">
                {typedAboutData.story.map((paragraph: string, index: number) => (
                  <p key={index} className={index > 0 ? "mt-4" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
          
          {/* Our Mission */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Mission</h2>
            <div className="bg-white border border-gray-200 rounded-md p-6">
              <div className="prose max-w-none text-gray-600">
                <p>{typedAboutData.mission.statement}</p>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {typedAboutData.mission.values.map((value: MissionValue, index: number) => (
                    <div key={index} className="bg-blue-50 rounded-md p-4">
                      <div className="text-blue-600 mb-2">
                        <i className={`fas ${value.icon} text-xl`}></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">{value.title}</h3>
                      <p className="text-sm text-gray-600">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Our Team */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Team</h2>
            <div className="bg-white border border-gray-200 rounded-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {typedAboutData.team.map((member: TeamMember, index: number) => (
                  <div key={index} className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                      <Image 
                        src={member.image} 
                        alt={member.name} 
                        width={128} 
                        height={128} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                    <p className="mt-2 text-sm text-gray-600">{member.bio}</p>
                    <div className="mt-3 flex justify-center space-x-3">
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      )}
                      {member.social.twitter && (
                        <a href={member.social.twitter} className="text-gray-400 hover:text-blue-400">
                          <i className="fab fa-twitter"></i>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Our Approach */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Approach</h2>
            <div className="bg-white border border-gray-200 rounded-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {typedAboutData.approach.slice(0, 2).map((item: ApproachItem, index: number) => (
                    <div key={index} className={index > 0 ? "mt-6" : ""}>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
                
                <div>
                  {typedAboutData.approach.slice(2, 4).map((item: ApproachItem, index: number) => (
                    <div key={index} className={index > 0 ? "mt-6" : ""}>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonials */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">What Our Users Say</h2>
            <div className="bg-white border border-gray-200 rounded-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {typedAboutData.testimonials.map((testimonial: Testimonial, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-md p-5">
                    <div className="text-yellow-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm italic">"{testimonial.quote}"</p>
                    <div className="mt-4 flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">{testimonial.name}</h4>
                        <p className="text-xs text-gray-500">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-blue-50 border-t border-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Join the IPO Insight Community</h2>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            Stay updated with the latest IPO news, analysis, and insights. 
            Join over 500,000 investors who trust IPO Insight for their investment decisions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/" 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Get Started
            </Link>
            <Link 
              href="/contact" 
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-6 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 