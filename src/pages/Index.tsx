import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Trash2, 
  PlusCircle, 
  PiggyBank, 
  Target, 
  TrendingUp,
  Receipt
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface Goal {
  id: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
}

const Index: React.FC = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalDescription, setGoalDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [expenses, goals]);

  const addExpense = () => {
    if (!description || !amount) {
      toast({
        title: "Error",
        description: "Please enter both description and amount",
        variant: "destructive"
      });
      return;
    }

    const newExpense: Expense = {
      id: `${Date.now()}`,
      description,
      amount: parseFloat(amount),
      date: new Date().toLocaleDateString(),
      category
    };

    setExpenses([...expenses, newExpense]);
    setDescription('');
    setAmount('');
    toast({
      title: "Success",
      description: "Expense added successfully"
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast({
      title: "Success",
      description: "Expense deleted successfully"
    });
  };

  const addGoal = () => {
    if (!goalDescription || !goalAmount) {
      toast({
        title: "Error",
        description: "Please enter both goal description and target amount",
        variant: "destructive"
      });
      return;
    }

    const newGoal: Goal = {
      id: `${Date.now()}`,
      description: goalDescription,
      targetAmount: parseFloat(goalAmount),
      currentAmount: 0
    };

    setGoals([...goals, newGoal]);
    setGoalDescription('');
    setGoalAmount('');
    setShowAddGoal(false);
    toast({
      title: "Success",
      description: "Financial goal added successfully"
    });
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast({
      title: "Success",
      description: "Financial goal deleted successfully"
    });
  };

  const updateGoalProgress = (goalId: string, amount: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newAmount = Math.min(goal.targetAmount, goal.currentAmount + amount);
        return { ...goal, currentAmount: newAmount };
      }
      return goal;
    }));
  };

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  
  const spendingByCategory = expenses.reduce((acc: Record<string, number>, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-700">Daily Expense Tracker</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Expense Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Receipt className="text-purple-600" />
            Add Expense
          </h2>
          
          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter expense description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter expense amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={addExpense} className="w-full bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="mr-2" /> Add Expense
          </Button>
        </div>

        {/* Financial Goals */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="text-purple-600" />
            Financial Goals
          </h2>

          {!showAddGoal ? (
            <Button 
              onClick={() => setShowAddGoal(true)}
              className="w-full mb-4 bg-purple-600 hover:bg-purple-700"
            >
              <PiggyBank className="mr-2" /> Add New Goal
            </Button>
          ) : (
            <div className="mb-4">
              <Input
                placeholder="Goal description"
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                className="mb-2"
              />
              <Input
                type="number"
                placeholder="Target amount"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button onClick={addGoal} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Save Goal
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {goals.map(goal => (
              <div key={goal.id} className="p-4 border rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{goal.description}</span>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-600">
                      ₹{goal.currentAmount} / ₹{goal.targetAmount}
                    </span>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => deleteGoal(goal.id)}
                      className="h-6 w-6"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Progress 
                  value={(goal.currentAmount / goal.targetAmount) * 100} 
                  className="mb-2"
                />
                <Input
                  type="number"
                  placeholder="Add amount"
                  className="mb-2"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      updateGoalProgress(goal.id, parseFloat(input.value));
                      input.value = '';
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expense List and Analytics */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-purple-600" />
          Expenses & Analytics
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold mb-2">Total Expenses</h3>
            <p className="text-2xl font-bold text-purple-700">₹{totalExpenses.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold mb-2">Spending by Category</h3>
            <div className="space-y-2">
              {Object.entries(spendingByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between">
                  <span className="capitalize">{category}</span>
                  <span>₹{amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center">No expenses yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-right p-2">Amount</th>
                  <th className="text-right p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b">
                    <td className="p-2">{expense.description}</td>
                    <td className="p-2 capitalize">{expense.category}</td>
                    <td className="p-2">{expense.date}</td>
                    <td className="p-2 text-right">₹{expense.amount.toFixed(2)}</td>
                    <td className="p-2 text-right">
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => deleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
