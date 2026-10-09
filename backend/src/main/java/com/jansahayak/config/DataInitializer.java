package com.jansahayak.config;

import com.jansahayak.entity.Resource;
import com.jansahayak.entity.Scheme;
import com.jansahayak.entity.User;
import com.jansahayak.entity.Video;
import com.jansahayak.repository.ResourceRepository;
import com.jansahayak.repository.SchemeRepository;
import com.jansahayak.repository.UserRepository;
import com.jansahayak.repository.VideoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

        private final SchemeRepository schemeRepository;
        private final VideoRepository videoRepository;
        private final ResourceRepository resourceRepository;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final String adminEmail;
        private final String adminPassword;

        public DataInitializer(SchemeRepository schemeRepository,
                        VideoRepository videoRepository,
                        ResourceRepository resourceRepository,
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        @Value("${app.admin.email:}") String adminEmail,
                        @Value("${app.admin.password:}") String adminPassword) {
                this.schemeRepository = schemeRepository;
                this.videoRepository = videoRepository;
                this.resourceRepository = resourceRepository;
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.adminEmail = adminEmail;
                this.adminPassword = adminPassword;
        }

        @Override
        public void run(String... args) {
                if (schemeRepository.count() == 0) {
                        schemeRepository.saveAll(List.of(
                                        new Scheme("PM-KISAN", "Direct income support for eligible farmers.", "Farmers",
                                                        "Small and marginal farmers",
                                                        "Landholding eligibility as defined by government norms and registration in the PM-KISAN portal.",
                                                        "Annual financial assistance to eligible farmers, helping with farming costs and household needs.",
                                                        "Aadhaar-seeded bank account details, land records, and farmer registration details.",
                                                        "Register online on the PM-KISAN portal and complete eKYC.",
                                                        "Check the latest schedule on the official PM-KISAN portal.",
                                                        "https://pmkisan.gov.in/",
                                                        "https://www.youtube.com/results?search_query=PM-KISAN+India",
                                                        "Pradhan Mantri Kisan Samman Nidhi",
                                                        "Department of Agriculture & Farmers Welfare",
                                                        "Central Government",
                                                        "Income support for eligible farmer families to help with agricultural and household expenses.",
                                                        "https://pmkisan.gov.in/",
                                                        "Eligibility varies by farmer registration status, land records, and verification requirements.",
                                                        "farmer, income-support, agriculture, rural",
                                                        "Official PM-KISAN portal",
                                                        "2026-10",
                                                        "PM-KISAN Government Information"),
                                        new Scheme("Ayushman Bharat PM-JAY",
                                                        "Health coverage for poor and vulnerable families.", "Health",
                                                        "Low-income families and senior citizens",
                                                        "Eligibility based on socio-economic criteria and family documentation as per PM-JAY rules.",
                                                        "Cashless treatment up to the covered limit for listed diseases and hospitalization.",
                                                        "Identity proof, family documents, and beneficiary verification details.",
                                                        "Check eligibility, create beneficiary records, and visit empanelled hospitals.",
                                                        "Varies by state; verify through official app or portal.",
                                                        "https://pmjay.gov.in/",
                                                        "https://www.youtube.com/results?search_query=Ayushman+Bharat+PM+JAY",
                                                        "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana",
                                                        "Ministry of Health and Family Welfare",
                                                        "Central Government",
                                                        "Healthcare coverage for eligible low-income families and senior citizens.",
                                                        "https://pmjay.gov.in/",
                                                        "Beneficiary coverage depends on state and eligibility verification.",
                                                        "healthcare, insurance, family, vulnerable",
                                                        "Official PM-JAY portal",
                                                        "2026-10",
                                                        "Ayushman Bharat Overview"),
                                        new Scheme("Pradhan Mantri Ujjwala Yojana",
                                                        "Free LPG connections to women from eligible households.",
                                                        "Women",
                                                        "Women from eligible low-income households",
                                                        "Income and household criteria prescribed by the scheme and beneficiary verification.",
                                                        "Free LPG connection and support for cleaner cooking fuel.",
                                                        "Aadhaar, household documentation, and bank details as required.",
                                                        "Apply through the official portal or local distributor with the required documents.",
                                                        "Scheme updates are announced by the government from time to time.",
                                                        "https://www.pmuy.gov.in/",
                                                        "https://www.youtube.com/results?search_query=Ujjwala+Yojana",
                                                        "Pradhan Mantri Ujjwala Yojana",
                                                        "Ministry of Petroleum & Natural Gas",
                                                        "Central Government",
                                                        "Support eligible households with clean cooking fuel access and reduced health risks.",
                                                        "https://www.pmuy.gov.in/",
                                                        "Income and family criteria are determined by scheme guidelines and verification.",
                                                        "women, energy, cooking, household",
                                                        "Official Ujjwala portal",
                                                        "2026-10",
                                                        "Ujjwala Yojana Explained"),
                                        new Scheme("Sukanya Samriddhi Yojana",
                                                        "Savings scheme for girl children that offers tax benefits.",
                                                        "Education", "Parents or guardians of girl children",
                                                        "Girl child below the age limit and valid guardianship documents.",
                                                        "Long-term savings with competitive interest and tax benefits.",
                                                        "Birth certificate, guardian documents, and bank or post office account details.",
                                                        "Open an account at a designated bank or post office with the required documentation.",
                                                        "Check official schedule for latest interest and maturity updates.",
                                                        "https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samriddhi-Yojana.aspx",
                                                        "https://www.youtube.com/results?search_query=Sukanya+Samriddhi+Yojana"),
                                        new Scheme("PM Vishwakarma", "Support for traditional artisans and craftsmen.",
                                                        "Employment",
                                                        "Artisans and craftsmen in eligible categories",
                                                        "Eligible artisans and crafts persons registered under the scheme.",
                                                        "Skill support, credit access and toolkit benefits for artisans.",
                                                        "Identity documents, artisan registration details, and supporting certificates.",
                                                        "Apply through the designated government process and support portal.",
                                                        "Annual or periodic updates are announced by the scheme authority.",
                                                        "https://www.pmvishwakarma.gov.in/",
                                                        "https://www.youtube.com/results?search_query=PM+Vishwakarma"),
                                        new Scheme("PM SVANidhi",
                                                        "Street vendor support for loans and working capital.",
                                                        "Employment",
                                                        "Street vendors and hawkers",
                                                        "Proof of street vending activity and eligibility as per local municipal records.",
                                                        "Collateral-free loans and support for micro-business development.",
                                                        "Vendor ID, local identity proof, and business-related documents.",
                                                        "Register on the portal and submit the required documents for verification.",
                                                        "Deadlines vary by state and local authority.",
                                                        "https://www.pmsvanidhi.mohua.gov.in/",
                                                        "https://www.youtube.com/results?search_query=PM+SVANidhi"),
                                        new Scheme("National Scholarship Portal",
                                                        "A central portal for scholarships for students.",
                                                        "Students", "School, college, and university students",
                                                        "Academic eligibility and family income criteria depending on the scholarship.",
                                                        "Financial support for education and study-related expenses.",
                                                        "Academic records, caste or income certificates if applicable, and bank details.",
                                                        "Register on the portal, fill the application form, and upload the required documents.",
                                                        "Application dates change according to the scholarship scheme.",
                                                        "https://scholarships.gov.in/",
                                                        "https://www.youtube.com/results?search_query=National+Scholarship+Portal"),
                                        new Scheme("Pradhan Mantri Awas Yojana (PMAY)",
                                                        "Housing support for economically weaker sections.",
                                                        "Financial Assistance",
                                                        "Urban and rural families who qualify under housing schemes",
                                                        "Income, family profile, and housing need criteria as set by state and central rules.",
                                                        "Subsidy support for building or improving a house.",
                                                        "Identity proof, income proof, and housing-related documents.",
                                                        "Apply through the official portal or local housing authority.",
                                                        "Deadlines depend on local scheme rounds and state announcements.",
                                                        "https://pmaymis.gov.in/",
                                                        "https://www.youtube.com/results?search_query=PMAY+housing+scheme"),
                                        new Scheme("Atal Pension Yojana",
                                                        "Pension plan for workers in the unorganized sector.",
                                                        "Financial Assistance",
                                                        "Workers and citizens in the unorganized sector",
                                                        "Age, contribution eligibility and registration with a participating bank or institution.",
                                                        "Regular pension benefits after retirement, depending on contribution.",
                                                        "Aadhaar, bank details, and age-related documents.",
                                                        "Register with a participating bank or pension service provider.",
                                                        "Keep the contribution and enrollment updated as per the scheme rules.",
                                                        "https://www.npscra.nsdl.co.in/",
                                                        "https://www.youtube.com/results?search_query=Atal+Pension+Yojana"),
                                        new Scheme("MGNREGA",
                                                        "Employment guarantee for rural households through public works.",
                                                        "Employment", "Rural households in eligible areas",
                                                        "Household registration and work-demand eligibility under rural employment rules.",
                                                        "Guaranteed wage employment and support for rural livelihood.",
                                                        "Job card, identity proof, and local registration records.",
                                                        "Apply at the local gram panchayat or rural employment office.",
                                                        "Work allocation and wage updates are issued by local authorities.",
                                                        "https://nrega.nic.in/",
                                                        "https://www.youtube.com/results?search_query=MGNREGA"),
                                        new Scheme("PM Jan Dhan Yojana", "Basic bank account for unbanked households.",
                                                        "Financial Assistance", "Unbanked families and citizens",
                                                        "Eligibility as per account opening rules set by the participating bank.",
                                                        "Easy access to savings accounts, insurance, and government benefits.",
                                                        "Identity proof, address proof, and basic bank account documents.",
                                                        "Visit a bank branch or partner institution to open the account.",
                                                        "Check official notifications for scheme updates.",
                                                        "https://pmjdy.gov.in/",
                                                        "https://www.youtube.com/results?search_query=PM+Jan+Dhan+Yojana"),
                                        new Scheme("Pradhan Mantri Fasal Bima Yojana",
                                                        "Crop insurance support to farmers.", "Farmers",
                                                        "Registered farmers and crop growers",
                                                        "Crop registration, land records, and compliance with notification requirements.",
                                                        "Insurance cover against crop loss due to natural risks.",
                                                        "Land records, crop details, and farmer registration documents.",
                                                        "Register through the scheme portal and local agriculture office.",
                                                        "Renewal and claims follow government notifications.",
                                                        "https://pmfby.gov.in/",
                                                        "https://www.youtube.com/results?search_query=Pradhan+Mantri+Fasal+Bima+Yojana"),
                                        new Scheme("Senior Citizen Savings Scheme",
                                                        "Savings scheme for senior citizens with secure interest returns.",
                                                        "Senior Citizens",
                                                        "Senior citizens meeting the scheme criteria",
                                                        "Age and account eligibility as per government rules.",
                                                        "Secure long-term savings with regular interest benefits.",
                                                        "Age proof, identity proof, and account opening documents.",
                                                        "Open the account through a post office or designated bank.",
                                                        "Interest rates and maturity terms are updated by official notifications.",
                                                        "https://www.indiapost.gov.in/Financial/Pages/Content/senior-citizen-savings-scheme.aspx",
                                                        "https://www.youtube.com/results?search_query=Senior+Citizen+Savings+Scheme"),
                                        new Scheme("Kisan Credit Card",
                                                        "Credit facility for farmers for working capital and crop needs.",
                                                        "Farmers", "Farmers and agricultural households",
                                                        "Landholding or agricultural activity eligibility as defined by banks.",
                                                        "Access to credit for farming and crop-related expenses.",
                                                        "Land records, identity proof, and bank account details.",
                                                        "Apply through a participating bank with the required documentation.",
                                                        "Check specific bank timelines and scheme updates.",
                                                        "https://www.indiapost.gov.in/Financial/Pages/Content/Kisan-Credit-Card.aspx",
                                                        "https://www.youtube.com/results?search_query=Kisan+Credit+Card"),
                                        new Scheme("National Health Mission",
                                                        "Public health support and health awareness initiatives.",
                                                        "Health",
                                                        "Citizens seeking public health support and facilities",
                                                        "Eligibility depends on the specific program or district-based health service.",
                                                        "Healthcare access, awareness, and public health support to citizens.",
                                                        "Identity and local health records when required.",
                                                        "Use the district health office or public health portal for information.",
                                                        "Program details vary by state and health department.",
                                                        "https://nhm.gov.in/",
                                                        "https://www.youtube.com/results?search_query=National+Health+Mission+India")));
                }

                if (videoRepository.count() == 0) {
                        videoRepository.saveAll(List.of(
                                        new Video("PM-KISAN Explained",
                                                        "A simple overview of the PM-KISAN scheme and who can apply.",
                                                        "Government Schemes",
                                                        "https://www.youtube.com/results?search_query=PM-KISAN+scheme+explained"),
                                        new Video("How to Apply for Scholarships",
                                                        "Guide to the National Scholarship Portal and application steps.",
                                                        "Education",
                                                        "https://www.youtube.com/results?search_query=National+Scholarship+Portal+guide"),
                                        new Video("Financial Literacy Basics",
                                                        "Simple ways to manage money and understand government support plans.",
                                                        "Financial Literacy",
                                                        "https://www.youtube.com/results?search_query=financial+literacy+for+students+India"),
                                        new Video("Ayushman Bharat Overview",
                                                        "Understand the health coverage benefits under Ayushman Bharat.",
                                                        "Health Awareness",
                                                        "https://www.youtube.com/results?search_query=Ayushman+Bharat+overview"),
                                        new Video("Career Opportunities and Employment Support",
                                                        "How government schemes support job seekers and small businesses.",
                                                        "Employment",
                                                        "https://www.youtube.com/results?search_query=government+schemes+employment+India")));
                }

                if (resourceRepository.count() == 0) {
                        resourceRepository.saveAll(List.of(
                                        new Resource("India Gov",
                                                        "Official government information portal for citizens and services.",
                                                        "Government Portals", "https://www.india.gov.in/"),
                                        new Resource("National Scholarship Portal",
                                                        "Scholarship opportunities for students across India.",
                                                        "Scholarships", "https://scholarships.gov.in/"),
                                        new Resource("National Career Service",
                                                        "Employment and career guidance portal for job seekers.",
                                                        "Employment", "https://www.ncs.gov.in/"),
                                        new Resource("National Health Mission",
                                                        "Public health schemes, resources and information.",
                                                        "Health", "https://nhm.gov.in/"),
                                        new Resource("Mahatma Gandhi National Rural Employment Guarantee Act",
                                                        "Employment support and rural welfare information.",
                                                        "Employment", "https://nrega.nic.in/"),
                                        new Resource("PM Jan Dhan Yojana",
                                                        "Basic banking and financial access information.",
                                                        "Financial Assistance", "https://pmjdy.gov.in/"),
                                        new Resource("MyGov", "Citizen engagement and government updates.",
                                                        "Government Portals",
                                                        "https://www.mygov.in/"),
                                        new Resource("National Portal of India",
                                                        "Government service and scheme information.",
                                                        "Government Portals", "https://www.india.gov.in/"),
                                        new Resource("National Skill Development Corporation",
                                                        "Skills and employability programs.",
                                                        "Employment", "https://www.nsdcindia.org/"),
                                        new Resource("National Emergency Helpline",
                                                        "Useful emergency and citizen support information.",
                                                        "Emergency", "https://www.india.gov.in/")));
                }

                if (!adminEmail.isBlank() && !adminPassword.isBlank()
                                && userRepository.findByEmail(adminEmail).isEmpty()) {
                        User admin = new User();
                        admin.setName("Admin User");
                        admin.setEmail(adminEmail);
                        admin.setPassword(passwordEncoder.encode(adminPassword));
                        admin.setRole(com.jansahayak.entity.Role.ADMIN);
                        userRepository.save(admin);
                }
        }
}
