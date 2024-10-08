"use client";
import LoadingOverlay from "@/app/_components/LoadingOverlay";
import QuizProgressAlert from "@/app/_components/QuizProgressAlert";
import GlobalApi from "@/app/_services/GlobalApi";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import { useTranslations } from "next-intl";

function Page({ params }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const quizId = params.taskId;
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const t = useTranslations('QuizPage');

  const languageFiles = {
    hi: {
      questions: "/analytics_questions_kids/hindi_questions.json",
      options: "/option_kids/hindi_options.json"
    },
    ur: {
      questions: "/analytics_questions_kids/urdu_questions.json",
      options: "/option_kids/urdu_options.json"
    },
    sp: {
      questions: "/analytics_questions_kids/spanish_questions.json",
      options: "/option_kids/spanish_options.json"
    },
    ge: {
      questions: "/analytics_questions_kids/german_questions.json",
      options: "/option_kids/german_options.json"
    },
    ben: {
      questions: "/analytics_questions_kids/bengali_questions.json",
      options: "/option_kids/bengali_options.json"
    },
    assa: {
      questions: "/analytics_questions_kids/assamese_questions.json",
      options: "/option_kids/assamese_options.json"
    },
    mar: {
      questions: "/analytics_questions_kids/marathi_questions.json",
      options: "/option_kids/marathi_options.json"
    },
    en:{
      questions: "/analytics_questions_kids/english_questions.json",
      options: "/option_kids/english_options.json"
    },
    mal:{
      questions: "/analytics_questions_kids/malayalam_questions.json",
      options: "/option_kids/malayalam_options.json"
    },
    tam:{
      questions: "/analytics_questions_kids/tamil_questions.json",
      options: "/option_kids/tamil_options.json"
    }
  };

  useEffect(() => {
    const authCheck = ()=>{
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token");
        if(!token){
          router.push('/login');
          setIsAuthenticated(false)
        }else{
          setIsAuthenticated(true)
        }
      }
    };
    authCheck()
  }, [router]);


  useEffect(() => {
    const getQuizData = async () => {
      setIsLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        const resp = await GlobalApi.GetQuizDataKids(quizId, token);
        // setQuestions(resp.data.questions);
        setCurrentQuestionIndex(resp.data.quizProgress);
        if (resp.data.quizProgress > 0) {
          setShowAlert(true);  // Set showAlert to true when resuming the quiz
        }
        const savedLanguage = localStorage.getItem('language') || 'en';
        let questionsData = []; // Use a local variable for questions
        let optionsData = [];
        const languageFile = languageFiles[savedLanguage.toLowerCase()].questions;
        if (languageFile) {
          const response = await fetch(languageFile);
          questionsData = await response.json(); 
          
        } else {
          console.error("Language file not found for:", savedLanguage);
        }
        const optionsFile = languageFiles[savedLanguage.toLowerCase()].options;
        console.log(optionsFile)
        
        if (optionsFile) {
          const optionsResponse = await fetch(optionsFile);
          optionsData = await optionsResponse.json(); 
        } else {
          console.error("Options file not found for:", savedLanguage);
        }

        questionsData = questionsData.map(question => ({
          ...question,
          options: optionsData.filter(option => option.question_id === question.id)
        }));
        setQuestions(questionsData); 
      } catch (error) {
        console.error("Error Fetching GetQuizData data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getQuizData();
  }, []);

  useEffect(() => {
    if (quizCompleted) {
      // setIsLoading(true)
      const interval = setInterval(() => {
        setSecondsRemaining((prevSeconds) => prevSeconds - 1);
      }, 1000);

      const timer = setTimeout(() => {
        const url = typeof window !== "undefined" ? localStorage.getItem("dashboardUrl") : null;
        router.replace(url);
        console.log("Route");
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [quizCompleted, router]);

  // useEffect(() => {
  //   // setIsLoading(true)
  //   if (questions?.length > 0) {
  //     // Shuffle choices when the component mounts or when the question changes
  //     // const choices = questions[currentQuestionIndex].answers.map(answer => answer.text);
  //     const choices = questions[currentQuestionIndex]?.answers;
  //     setShuffledChoices(choices.sort(() => Math.random() - 0.5));
  //   }

  //   // setIsLoading(false)
  // }, [currentQuestionIndex, questions]);

  useEffect(() => {
    // Shuffle and set options for the current question
    if (questions.length > 0 && questions[currentQuestionIndex]?.options) {
      const choices = questions[currentQuestionIndex].options;
      console.log(choices)
      setShuffledChoices([...choices].sort(() => Math.random() - 0.5));
    }
  }, [currentQuestionIndex, questions]);

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);
  };

  const handleNext = async () => {

    const answer = {
                      questionId: questions[currentQuestionIndex].id,
                      optionId: selectedChoice.id,
                      optionText: selectedChoice.text,
                      analyticId: selectedChoice.analytic_id,
                    }

    await quizProgressSubmit(answer); 
      
    if (currentQuestionIndex < questions.length - 1) {
      /* Api to save the progress */
      setSelectedChoice(null); // Resetting selected choice for the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);

    } else {
      setQuizCompleted(true);
      quizSubmit(); // Quiz finished, send data to API
    }
  };

  const quizProgressSubmit = async (data) => {
    setProgressLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const resp = await GlobalApi.SaveQuizProgress(data, token, quizId);
    
        if (resp && resp.status === 201) {
          console.log("Response:", resp.data);
        } else {
          console.error("Failed to save progress. Status code:", resp.status);
          alert("There was a problem saving your progress. Please check your internet connection.");
        }
      } catch (error) {
        console.error("Error submitting progress:", error.message);
        alert("There was an error saving your progress. Please try again later.");
        alert(t('errorSavingProgress'))
      } finally {
        setProgressLoading(false);
      }
  };


  const quizSubmit = async () => {
    setIsLoading(true);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const resp = await GlobalApi.SaveQuizResult(token);

      if (resp && resp.status === 201) {
        toast.success("Quiz Completed successfully!.");
        toast.success(t('quizSubmitSuccess'));
      } else {
        // toast.error('Failed to create Challenge.');
        toast.error("Failed Submitted results");
      }
    } catch (error) {
      console.error("Error creating Submitting:", error);
      console.error("Error creating Submiting:", error.message);
      // toast.error('Error: Failed to create Challenge.');
      toast.error("Error Error: Failed to submit quiz.");
      toast.error(t('quizSubmitFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <div>
          <div className="font-semibold">
            <LoadingOverlay loadText={t('loading')} />
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-center">
        <div>
          <div className="text-4xl font-semibold">
            {t('quizCompletedSuccess')}
          </div>

          <p className="mt-4">
            {t('navigating')} {secondsRemaining} seconds
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen ">
      <Toaster
        position="top-center"
        reverseOrder={false}
        />
      <div className="bg-[#009be8] h-20 my-4 justify-center items-center flex">
        <p className="text-white uppercase font-bold text-center">
          {t('personalityAssessment')}
        </p>
      </div>
      {
        showAlert && (
          <QuizProgressAlert />
        )
      }
      <div className="mx-3 flex justify-center items-center">
        {questions.length > 0 && (
          <div className="mt-4 pt-5 min-h-[20rem] flex flex-col gap-4 justify-center items-center mx-auto sm:w-4/5 w-full max-w-[800px] text-white rounded-2xl p-[1px] bg-[#0097b2]">
            <div className="">
              <p className="font-extrabold text-center">
                {" "}
                {currentQuestionIndex + 1}/12
              </p>
            </div>
            {
              !progressLoading ? (
                <div className="bg-[#1b143a] w-full p-3 rounded-2xl pt-6 ">
                  <div>
                    <p className="font-bold p-2 text-xl text-center mb-6">
                      {questions[currentQuestionIndex]?.question}
                    </p>
                  </div>
                  <div className="flex flex-col gap-5 w-full text-white">
                    {shuffledChoices.map((choice, index) => (
                      <button
                        key={index}
                        className={cn(
                          `py-5 px-4 rounded-full hover:cursor-pointer
                    hover:text-black  transition duration-300 ease-in-out `,
                          selectedChoice?.id === choice.id
                            ? "bg-green-500"
                            : "bg-[#0070c0] hover:bg-green-500"
                        )}
                        onClick={() => handleChoiceSelect(choice)}
                      >
                        {choice.text}
                      </button>
                    ))}
                  </div>
                  <div className="w-full justify-center items-center flex my-5">
                    <div>
                      {/* <button
                      className={`bg-[#7824f6] py-2 px-10 rounded-full text-white ${
                        selectedChoice ? "" : "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={handleNext}
                      disabled={!selectedChoice}
                    >
                      Next
                    </button> */}
                      <button
                        className={`bg-[#7824f6] py-2 px-10 rounded-full text-white ${selectedChoice ? "" : "opacity-50 cursor-not-allowed"
                          }`}
                        onClick={handleNext}
                        disabled={!selectedChoice}
                      >
                        {t('next')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="inset-0 flex items-center my-16 justify-center z-50">
                  <div className="flex items-center space-x-2">
                    <LoaderIcon className="w-10 h-10 text-white text-4xl animate-spin" />
                    <span className="text-white">{t('loading')}</span>
                  </div>
                </div>
              )

            }
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
