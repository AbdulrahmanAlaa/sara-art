const logotext = "SARA";
const meta = {
    title: "Sara Mohammed",
    description: "I’m Sara Mohammed illustrator  _ Character designer, currently living in Dubai, ",
};

const introdata = {
    title: "I’m Sara Mohammed",
    animated: {
        first: "I love illustrating",
        second: "I make cool characters",
        third: "I love bringing characters and worlds to life.",
    },
    description: "I’m a character designer and illustrator based in Dubai. I love creating characters and bringing them to life through my illustrations.\
     I have a passion for storytelling and I believe that every character has a story to tell.",
    your_img_url: "https://drive.google.com/file/d/1kr2SLTrTtBbq9e6ucNI-c1u800pGaM1B/view?usp=sharing",
};

const dataabout = {
    title: "abit about my self",
    aboutme: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis dolor id ligula semper elementum feugiat pretium nulla. Nunc non commodo dolor. Nunc mollis dignissim facilisis. Morbi ut magna ultricies.",
};
const worktimeline = [{
    jobtitle: "Designer of week",
    where: "YAdfi",
    date: "2020",
},
{
    jobtitle: "Designer of week",
    where: "Jamalya",
    date: "2019",
},
{
    jobtitle: "Designer of week",
    where: "ALquds",
    date: "2019",
},
];

const skills = [{
    name: "Python",
    value: 90,
},
{
    name: "Djano",
    value: 85,
},
{
    name: "Javascript",
    value: 80,
},
{
    name: "React",
    value: 60,
},
{
    name: "Jquery",
    value: 85,
},
];

const services = [{
    title: "UI & UX Design",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at nisl euismod urna bibendum sollicitudin.",
},
{
    title: "Mobile Apps",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at nisl euismod urna bibendum sollicitudin.",
},
{
    title: "Wordpress Design",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at nisl euismod urna bibendum sollicitudin.",
},
];
import proj1_1 from "./assets/images/project1/1.png";
import proj1_2 from "./assets/images/project1/2.png";
import proj1_3 from "./assets/images/project1/3.png";
const dataportfolio = [{
    img: proj1_1,
    id: '1',
    description: "Character design",
    link: "#",
}
];
const dataportfolioDetails = {
    '1': [
        {
            img: proj1_1,
        },
        {
            img: proj1_2,
        },
        {
            img: proj1_3,
        },
    ]
};
const contactConfig = {
    YOUR_EMAIL: "name@domain.com",
    YOUR_FONE: "(555)123-4567",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vehicula eu nunc et sollicitudin. Cras pulvinar, nisi at imperdiet pharetra. ",
    // creat an emailjs.com account 
    // check out this tutorial https://www.emailjs.com/docs/examples/reactjs/
    YOUR_SERVICE_ID: "service_id",
    YOUR_TEMPLATE_ID: "template_id",
    YOUR_USER_ID: "user_id",
};

const socialprofils = {
    instagram: "https://www.instagram.com/sarahmohammed_art/",
    linkedin: "https://www.linkedin.com/in/sarah-mohammed-25203419b/",
    behance: "https://www.behance.net/sarahmohammmed934",
};
export {
    meta,
    dataabout,
    dataportfolio,
    worktimeline,
    skills,
    services,
    introdata,
    contactConfig,
    socialprofils,
    dataportfolioDetails,
    logotext,
};