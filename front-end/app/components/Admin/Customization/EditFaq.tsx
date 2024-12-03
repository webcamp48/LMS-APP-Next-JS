import { useGetHeroDataQuery, useEditLayoutMutation } from '@/redux/features/layout/layout';
import React, { useEffect, useState } from 'react';
import { HiPlus, HiMinus } from 'react-icons/hi';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { styles } from '@/app/styles/style';
import toast from 'react-hot-toast';
import Loader from '../../Loader/Loader';


const EditFaq = () => {
    const { data, isLoading, refetch } = useGetHeroDataQuery('FAQ', { refetchOnMountOrArgChange: true });
    const [editLayout, { isSuccess, error }] = useEditLayoutMutation();
    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setQuestions(data?.layout?.faq || []);
        }
    }, [data]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('FAQ updated successfully');
            refetch();
        }
        if (error && 'data' in error) {
            const errorMessage = error as any;
            toast.error(errorMessage?.data?.message || 'Error occurred');
        }
    }, [isSuccess, error, refetch]);

    const toggleQuestion = (id: string) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
        );
    };

    const handleQuestionChange = (id: string, value: string) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) => (q._id === id ? { ...q, question: value } : q))
        );
    };

    const handleAnswerChange = (id: string, value: string) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) => (q._id === id ? { ...q, answer: value } : q))
        );
    };

    const newFaqHandler = () => {
        setQuestions([
            ...questions,
            {
                _id: `new-${Date.now()}`, // Temporary ID for new items
                question: '',
                answer: '',
                active: true,
            },
        ]);
    };

    const deleteFaqHandler = (id: string) => {
        setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== id));
    };

    const areQuestionsUnchanged = (oldQuestions: any[], newQuestions: any[]) => {
        return JSON.stringify(oldQuestions) === JSON.stringify(newQuestions);
    };

    const isAnyQuestionEmpty = (questions: any[]) => {
        return questions.some((q) => !q.question.trim() || !q.answer.trim());
    };

    const handleEdit = async () => {
        if (
            !areQuestionsUnchanged(data.layout.faq, questions) &&
            !isAnyQuestionEmpty(questions)
        ) {
            try {
                await editLayout({
                    type: 'FAQ',
                    faq: questions,
                });
            } catch (error) {
                console.error('Error updating FAQ:', error);
            }
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="w-[90%] 800px:w-[80%] min-h-screen my-[120px]">
            <div className="mt-12">
                <dl className="space-y-8">
                    {questions.map((q) => (
                        <div
                            key={q._id}
                            className={`${
                                q._id !== questions[0]?._id && 'border-t'
                            } border-gray-200 pt-6`}
                        >
                            <dt className="text-lg">
                                <button
                                    className="flex items-center text-black dark:text-white justify-between text-left w-full focus:outline-none"
                                    onClick={() => toggleQuestion(q._id)}
                                >
                                    <input
                                        className={`${styles.input} border-none`}
                                        value={q.question}
                                        onChange={(e) => handleQuestionChange(q._id, e.target.value)}
                                        placeholder="Add Your Question"
                                    />
                                    <span className="ml-6 flex-shrink-0">
                                        {q.active ? (
                                            <HiMinus className="w-6 h-6" />
                                        ) : (
                                            <HiPlus className="w-6 h-6" />
                                        )}
                                    </span>
                                </button>
                            </dt>
                            {q.active && (
                                <dd className="mt-2 pr-12">
                                    <input
                                        className={`${styles.input} border-none`}
                                        value={q.answer}
                                        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                        placeholder="Add Your Answer"
                                    />
                                    <span className="ml-6 flex-shrink-0">
                                        <AiOutlineDelete
                                            className="text-[18px] text-black dark:text-white cursor-pointer"
                                            onClick={() => deleteFaqHandler(q._id)}
                                        />
                                    </span>
                                </dd>
                            )}
                        </div>
                    ))}
                </dl>
                <br />
                <IoMdAddCircleOutline
                    className="text-[28px] text-black dark:text-white cursor-pointer"
                    onClick={newFaqHandler}
                />
            </div>
            <button
                className={`${
                    styles.button
                } !w-[100px] !min-h-[40px] !h-[40px] text-black dark:text-white bg-[#000034] ${
                    areQuestionsUnchanged(data.layout.faq, questions) || isAnyQuestionEmpty(questions)
                        ? '!cursor-not-allowed'
                        : '!cursor-pointer !bg-[#42d382]'
                } !rounded absolute bottom-22 right-12`}
                onClick={
                    areQuestionsUnchanged(data.layout.faq, questions) || isAnyQuestionEmpty(questions)
                        ? () => null
                        : handleEdit
                }
                disabled={
                    areQuestionsUnchanged(data.layout.faq, questions) || isAnyQuestionEmpty(questions)
                }
            >
                Save
            </button>
        </div>
    );
};

export default EditFaq;
