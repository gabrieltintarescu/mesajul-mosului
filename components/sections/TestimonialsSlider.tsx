'use client';

import { Testimonial } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const testimonials: Testimonial[] = [
    {
        id: '1',
        name: 'Maria P.',
        location: 'București, România',
        content: 'Fața fetiței mele s-a luminat când Moșul i-a spus numele și a menționat dragostea ei pentru unicorni! L-a urmărit de 10 ori. Absolut magic!',
        rating: 5,
    },
    {
        id: '2',
        name: 'Andrei D.',
        location: 'Cluj-Napoca, România',
        content: 'Cel mai bun cadou de Crăciun! Fiul meu nu-i venea să creadă că Moșul știa despre performanțele lui la fotbal. Merită fiecare ban.',
        rating: 5,
    },
    {
        id: '3',
        name: 'Elena M.',
        location: 'Iași, România',
        content: 'Calitatea video este uimitoare și personalizarea este perfectă. Copiii mei cred că e Moșul adevărat! Vom comanda și anul viitor.',
        rating: 5,
    },
    {
        id: '4',
        name: 'Cristian R.',
        location: 'Timișoara, România',
        content: 'Atât de ușor de folosit și livrat în câteva minute. Fiica mea a rămas fără cuvinte când Moșul a felicitat-o pentru că a învățat să citească!',
        rating: 5,
    },
];

export function TestimonialsSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    };

    return (
        <div className="relative max-w-4xl mx-auto">
            {/* Quote decoration */}
            <Quote className="absolute -top-4 -left-4 w-16 h-16 text-christmas-gold/20 transform -rotate-12" />

            <div className="relative overflow-hidden py-2 md:py-8 px-4">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="bg-white rounded-xl md:rounded-3xl shadow-xl p-4 md:p-12"
                    >
                        {/* Stars */}
                        <div className="flex items-center justify-center gap-0.5 md:gap-1 mb-2 md:mb-6">
                            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 md:w-6 md:h-6 text-christmas-gold fill-current" />
                            ))}
                        </div>

                        {/* Content */}
                        <p className="text-sm md:text-2xl text-gray-700 text-center leading-snug md:leading-relaxed mb-3 md:mb-8">
                            "{testimonials[currentIndex].content}"
                        </p>

                        {/* Author */}
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-christmas-red to-red-600 
                flex items-center justify-center text-white text-sm md:text-xl font-bold mb-1.5 md:mb-3">
                                {testimonials[currentIndex].name.charAt(0)}
                            </div>
                            <p className="text-sm md:text-base font-semibold text-gray-900">{testimonials[currentIndex].name}</p>
                            <p className="text-xs md:text-sm text-gray-500">{testimonials[currentIndex].location}</p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6
          w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center
          text-gray-600 hover:text-christmas-red hover:scale-110 transition-all"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6
          w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center
          text-gray-600 hover:text-christmas-red hover:scale-110 transition-all"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        className={`
              w-2.5 h-2.5 rounded-full transition-all duration-300
              ${index === currentIndex
                                ? 'bg-christmas-red w-8'
                                : 'bg-gray-300 hover:bg-gray-400'
                            }
            `}
                    />
                ))}
            </div>
        </div>
    );
}
