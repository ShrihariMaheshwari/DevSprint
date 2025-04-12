
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSprint } from "@/context/SprintContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  sprintId: z.string(),
  date: z.string(),
  reflections: z.string().min(10, "Reflection must be at least 10 characters"),
});

const CreateDailyLog: React.FC = () => {
  const navigate = useNavigate();
  const { sprints, addDailyLog, currentSprint } = useSprint();
  
  const [tasksCompleted, setTasksCompleted] = useState<string[]>(['']);
  const [blockers, setBlockers] = useState<string[]>(['']);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sprintId: currentSprint?.id || "",
      date: new Date().toISOString().slice(0, 10),
      reflections: "",
    },
  });
  
  const handleAddTask = () => {
    setTasksCompleted([...tasksCompleted, '']);
  };
  
  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...tasksCompleted];
    newTasks[index] = value;
    setTasksCompleted(newTasks);
  };
  
  const handleRemoveTask = (index: number) => {
    if (tasksCompleted.length > 1) {
      const newTasks = tasksCompleted.filter((_, i) => i !== index);
      setTasksCompleted(newTasks);
    }
  };
  
  const handleAddBlocker = () => {
    setBlockers([...blockers, '']);
  };
  
  const handleBlockerChange = (index: number, value: string) => {
    const newBlockers = [...blockers];
    newBlockers[index] = value;
    setBlockers(newBlockers);
  };
  
  const handleRemoveBlocker = (index: number) => {
    if (blockers.length > 1) {
      const newBlockers = blockers.filter((_, i) => i !== index);
      setBlockers(newBlockers);
    }
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Filter out empty tasks and blockers
    const filteredTasks = tasksCompleted.filter(task => task.trim() !== '');
    const filteredBlockers = blockers.filter(blocker => blocker.trim() !== '');
    
    addDailyLog({
      sprintId: values.sprintId,
      date: values.date,
      tasksCompleted: filteredTasks,
      blockers: filteredBlockers,
      reflections: values.reflections,
    });
    
    navigate("/");
  };
  
  const today = format(new Date(), "yyyy-MM-dd");
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Daily Log</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Daily Progress</CardTitle>
            <CardDescription>
              Record what you accomplished today
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="sprintId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sprint</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a sprint" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sprints.map((sprint) => (
                              <SelectItem key={sprint.id} value={sprint.id}>
                                {sprint.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} max={today} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Tasks Completed</FormLabel>
                  {tasksCompleted.map((task, index) => (
                    <div key={`task-${index}`} className="flex gap-2">
                      <Input
                        value={task}
                        onChange={(e) => handleTaskChange(index, e.target.value)}
                        placeholder="e.g. Implemented login functionality"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTask(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleAddTask}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Blockers</FormLabel>
                  {blockers.map((blocker, index) => (
                    <div key={`blocker-${index}`} className="flex gap-2">
                      <Input
                        value={blocker}
                        onChange={(e) => handleBlockerChange(index, e.target.value)}
                        placeholder="e.g. Struggling with API integration"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveBlocker(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleAddBlocker}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Blocker
                  </Button>
                </div>
                
                <FormField
                  control={form.control}
                  name="reflections"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reflections & Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How did today go? What did you learn?" 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <CardFooter className="px-0 pb-0">
                  <Button type="submit" className="ml-auto">Save Log Entry</Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateDailyLog;
