import { LeetCodeQuestion } from '../types';

export const mockQuestions: LeetCodeQuestion[] = [
  {
    id: 1,
    title: "Cricket Score Calculator",
    difficulty: "Medium",
    content: "In a cricket match, a batsman scores runs in the following way: 1 run, 4 runs (boundary), 6 runs (sixer). Given an array of N deliveries, calculate the total score. Note: A dot ball (no run) is represented as 0."
  },
  {
    id: 2,
    title: "Thanksgiving Dinner Planning",
    difficulty: "Easy",
    content: "You are planning a Thanksgiving dinner and need to buy turkeys. Each turkey feeds 8 people. Given the number of guests N, return the minimum number of turkeys needed."
  },
  {
    id: 3,
    title: "Diwali Light Arrangement",
    difficulty: "Hard",
    content: "During Diwali festival, houses are decorated with diyas (clay lamps). Given N houses in a row and K diyas, find the maximum distance between any two adjacent diyas when placed optimally."
  }
];