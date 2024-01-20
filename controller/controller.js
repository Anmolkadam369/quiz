let mongoose = require("mongoose");
const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};
const validatePassword = (password) => {
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}/.test(password);
};

const quizQuestions = [
    {
        index:"1",
        question: 'What is the capital of France?',
        answer: 'Paris',
    },
    {
        index:"2",
        question: 'Which planet is known as the Red Planet?',
        answer: 'Mars',
    },
    {
        index:"3",
        question: 'What is the largest mammal in the world?',
        answer: 'Blue whale',
    },
    {
        index: "4",
        question: 'In which year did World War II end?',
        answer: '1945',
    },
    {
        index: "5",
        question: 'Who wrote "Romeo and Juliet"?',
        answer: 'Shakespeare',
    },
    {
        index: "6",
        question: 'What is the chemical symbol for gold?',
        answer: 'Au',
    },
    {
        index: "7",
        question: 'Which programming language is known for its versatility and ease of use?',
        answer: 'Python',
    },
    {
        index: "8",
        question: 'What is the largest ocean on Earth?',
        answer: 'Pacific',
    },
    {
        index: "9",
        question: 'In what year did the Titanic sink?',
        answer: '1912',
    },
    {
        index: "10",
        question: 'What is the capital of Japan?',
        answer: 'Tokyo',
    },
    {
        index: "11",
        question: 'Which gas is most abundant in Earth\'s atmosphere?',
        answer: 'Nitrogen',
    },
    {
        index: "12",
        question: 'Who painted the Mona Lisa?',
        answer: 'Da Vinci',
    },
    {
        index: "13",
        question: 'What is the currency of Brazil?',
        answer: 'Real',
    },
    {
        index: "14",
        question: 'Who is the author of "To Kill a Mockingbird"?',
        answer: 'Harper Lee',
    },
    {
        index: "15",
        question: 'Which country is known as the Land of the Rising Sun?',
        answer: 'Japan',
    },
    {
        index: "16",
        question: 'What is the capital of Australia?',
        answer: 'Canberra',
    },
  
    {
        index: "17",
        question: 'Which element has the chemical symbol "H"?',
        answer: 'Hydrogen',
    },
    {
        index: "18",
        question: 'What is the largest desert in the world?',
        answer: 'Antarctica',
    },
    {
        index: "19",
        question: 'In what year did the United States declare its independence?',
        answer: '1776',
    },
    {
        index: "20",
        question: 'Who is known as the "Father of Modern Physics"?',
        answer: 'Einstein',
    },
    {
        index: "21",
        question: 'What is the square root of 64?',
        answer: '8',
    },
    {
        index: "22",
        question: 'Which animal is known as the "King of the Jungle"?',
        answer: 'Lion',
    },
    {
        index: "23",
        question: 'What is the tallest mountain in the world?',
        answer: 'Mount Everest',
    },
    {
        index: "24",
        question: 'Who wrote "1984"?',
        answer: 'George Orwell',
    },
    {
        index: "25",
        question: 'What is the chemical symbol for oxygen?',
        answer: 'O',
    },
    {
        index: "26",
        question: 'Which planet is known as the "Morning Star" or "Evening Star"?',
        answer: 'Venus',
    },
    {
        index: "27",
        question: 'What is the main ingredient in guacamole?',
        answer: 'Avocado',
    },
    {
        index: "28",
        question: 'Who painted "Starry Night"?',
        answer: 'Van Gogh',
    },
    {
        index: "29",
        question: 'What is the currency of China?',
        answer: 'Yuan',
    },
    {
        index: "30",
        question: 'Who discovered penicillin?',
        answer: 'Fleming',
    },
];


const signup = async function (req, res) {
    try {
        console.log("some", req.body);
        let data = req.body;
        let { name, email, password } = data;

        name = data.name = name.trim();
        if (name === '') return res.status(400).send({ status: false, message: `empty name not possible` });

        email = data.email = email.trim().toLowerCase()
        if (email === "") return res.status(400).send({ status: false, message: `empty email not possible` });
        if (!validateEmail(email)) {
            return res.status(400).send({ status: false, message: `invalid email format` });
        }

        password = data.password = password.trim()
        if (password === "") return res.status(400).send({ status: false, message: `empty password not possible` });
        if (!validatePassword(password)) {
            return res.status(400).send({ status: false, message: `invalid password format` });
        }

        const foundEmail = await userModel.findOne({ $or: [{ email: email }, { name: name }] });
        if (foundEmail) return res.status(400).send({ status: false, message: `email or userName already in use` });

        let hashing = bcrypt.hashSync(password, 10);
        data.password = hashing;

        let createdData = await userModel.create(data);
        return res.status(201).send({ status: true, data: createdData });
    } catch (error) {
        return res.status(500).send({ status: false, message: `error ${error.message}` })
    }
}

const signIn = async function (req, res) {

    try {
        console.log("some", req.body);
        let data = req.body;
        let { email, password } = data;

        email = data.email = email.trim().toLowerCase()
        if (email === "") return res.status(400).send({ status: false, message: `empty email not possible buddy` });
        if (!validateEmail(email)) {
            return res.status(400).send({ status: false, message: `invalid email format` });
        }
        password = data.password = password.trim()
        if (password === "") return res.status(400).send({ status: false, message: `empty password not possible buddy` });
        if (!validatePassword(password)) {
            return res.status(400).send({ status: false, message: `invalid password format` });
        }
        let foundUserName = await userModel.findOne({ email: email });
        if (!foundUserName) return res.status(400).send({ status: false, message: `${email} isn't available !!!` });
        console.log(foundUserName, password)

        let passwordCompare = await bcrypt.compare(password, foundUserName.password);
        if (!passwordCompare) return res.status(400).send({ status: false, message: "Please enter valid password" })

        let token = jwt.sign(
            { userId: foundUserName._id, exp: Math.floor(Date.now() / 1000) + 86400 },
            "project"
        );

        let tokenInfo = { userId: foundUserName._id, token: token };

        res.setHeader('x-api-key', token)
        return res.status(200).send({ status: true, data: foundUserName, tokenData: tokenInfo });
    } catch (error) {
        return res.status(500).send({ status: false, message: `error ${error.message}` })
    }
}

const getAllUser = async function (req, res) {
    try {
        let data = await userModel.find({ isDeleted: false });
        if (data.length == 0) return res.status(404).send({ status: false, message: "No Data found" });
        return res.status(200).send({ status: true, data: data });

    } catch (error) {
        return res.status(500).send({ status: false, message: `error ${error.message}` })
    }
}

const getQuiz = async function (req, res) {
    try {
        console.log("quiz");
        let responseQuiz = [];
        const usedIndices = new Set();
        const maxQuestions = 10;
    
        while (responseQuiz.length < maxQuestions) {
            const randomIndex = Math.floor(Math.random() * quizQuestions.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                responseQuiz.push(quizQuestions[randomIndex]);}
        }
        console.log("responseQuiz", responseQuiz);
        return res.status(200).send({ status: true, data: responseQuiz });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

const totalMarks = async function(req,res){
    try {
       let data = req.body, count=0;
       for(let i=0;i<data.length;i++){
        const comingQuestion = data[i].question;
        const comingAnswer =  data[i].answer;
        let foundQuestion = quizQuestions.find(findQuestion => findQuestion.question == comingQuestion);
        if(foundQuestion.answer == comingAnswer) count++;
       } 
       return res.status(200).send({ status: true, data: count });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}





module.exports = { signIn, signup, getAllUser,getQuiz,totalMarks} 