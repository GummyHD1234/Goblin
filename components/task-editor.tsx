"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Edit2, Search, FileUp, FileDown } from "lucide-react";
import { formatNumberInput, compareTaskNumbers, validateImportData } from "@/lib/utils";
import { MediaUpload } from "./media-upload";
import { MediaPreview } from "./media-preview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Task, SearchItem } from "@/types/tasks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaskEditorProps {
  tasks: Task[];
  searchItems: SearchItem[];
  onTasksChange: (tasks: Task[]) => void;
  onSearchItemsChange: (items: SearchItem[]) => void;
}

export function TaskEditor({
  tasks,
  searchItems,
  onTasksChange,
  onSearchItemsChange,
}: TaskEditorProps) {
  const [newTask, setNewTask] = useState<Task>({
    id: "",
    question: "",
    solution: "",
    room: "",
    tip: "",
    key: "",
    media: [],
  });

  const [newSearchItem, setNewSearchItem] = useState<SearchItem>({
    item: "",
    location: "",
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingSearchItem, setEditingSearchItem] = useState<SearchItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchItemQuery, setSearchItemQuery] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleIdChange = (value: string) => {
    setNewTask({ ...newTask, id: formatNumberInput(value) });
  };

  const addTask = () => {
    if (newTask.id && newTask.question && newTask.solution) {
      if (tasks.some(task => task.id === newTask.id)) {
        toast({
          title: "Fehler",
          description: `Auftrag ${newTask.id} existiert bereits.`,
          variant: "destructive",
        });
        return;
      }

      onTasksChange([...tasks, newTask]);
      setNewTask({ id: "", question: "", solution: "", room: "", tip: "", key: "", media: [] });
    }
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
  };

  const saveEditedTask = () => {
    if (editingTask) {
      onTasksChange(tasks.map(t => t.id === editingTask.id ? editingTask : t));
      setEditingTask(null);
    }
  };

  const confirmDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteDialog(true);
  };

  const deleteTask = () => {
    if (taskToDelete) {
      onTasksChange(tasks.filter(task => task.id !== taskToDelete.id));
      setShowDeleteDialog(false);
      setTaskToDelete(null);
    }
  };

  const handleMediaUpload = (taskId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      const mediaType = file.type.startsWith('image/') ? 'image' : 'video';

      onTasksChange(tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            media: [...(task.media || []), { type: mediaType as "image" | "video", url: base64Data }]
          };
        }
        return task;
      }));
    };
    reader.readAsDataURL(file);
  };

  const deleteMedia = (taskId: string, mediaIndex: number) => {
    onTasksChange(tasks.map(task => {
      if (task.id === taskId && task.media) {
        return {
          ...task,
          media: task.media.filter((_, index) => index !== mediaIndex)
        };
      }
      return task;
    }));
  };

  const addSearchItem = () => {
    if (newSearchItem.item && newSearchItem.location) {
      if (searchItems.some(item => item.item === newSearchItem.item)) {
        toast({
          title: "Fehler",
          description: `Gegenstand "${newSearchItem.item}" existiert bereits.`,
          variant: "destructive",
        });
        return;
      }

      onSearchItemsChange([...searchItems, newSearchItem]);
      setNewSearchItem({ item: "", location: "" });
    }
  };

  const editSearchItem = (item: SearchItem) => {
    setEditingSearchItem(item);
  };

  const saveEditedSearchItem = () => {
    if (editingSearchItem) {
      onSearchItemsChange(searchItems.map(item => 
        item.item === editingSearchItem.item ? editingSearchItem : item
      ));
      setEditingSearchItem(null);
    }
  };

  const deleteSearchItem = (item: string) => {
    onSearchItemsChange(searchItems.filter(i => i.item !== item));
  };

  const handleExport = () => {
    const data = {
      tasks: tasks.map(task => ({
        ...task,
        media: task.media || []
      })),
      searchItems: searchItems,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Aufträge_${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export erfolgreich",
      description: "Die Daten wurden erfolgreich exportiert.",
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowImportDialog(true);
    }
    event.target.value = '';
  };

  const handleImport = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        const validation = validateImportData(data);

        if (validation.isValid && validation.tasks && validation.searchItems) {
          onTasksChange(validation.tasks);
          onSearchItemsChange(validation.searchItems);
          toast({
            title: "Import erfolgreich",
            description: "Alle Daten wurden erfolgreich importiert.",
          });
        } else {
          toast({
            title: "Import fehlgeschlagen",
            description: validation.error || "Ungültiges Dateiformat",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Import fehlgeschlagen",
          description: "Die Datei konnte nicht gelesen werden: " + (error as Error).message,
          variant: "destructive",
        });
      }
    };
    reader.readAsText(selectedFile);
    setShowImportDialog(false);
    setSelectedFile(null);
  };

  const filteredTasks = tasks
    .filter(task => 
      task.id.includes(searchQuery) || 
      task.question.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => compareTaskNumbers(a.id, b.id));

  const filteredSearchItems = searchItems.filter(item =>
    item.item.toLowerCase().includes(searchItemQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchItemQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import bestätigen</AlertDialogTitle>
            <AlertDialogDescription>
              Import bestätigen: Achtung! Beim Importieren werden alle aktuellen Aufträge gelöscht und durch die Aufträge aus dem importierten Backup ersetzt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowImportDialog(false);
              setSelectedFile(null);
            }}>
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleImport}>
              Fortfahren
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bist du dir sicher, dass du den Auftrag löschen möchtest?</AlertDialogTitle>
            <div className="text-3xl font-bold text-center my-4">
              {taskToDelete?.id}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false);
              setTaskToDelete(null);
            }}>
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction onClick={deleteTask}>
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tasks">Aufträge bearbeiten</TabsTrigger>
          <TabsTrigger value="items">Gesuchte Gegenstände</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Input
                placeholder="Suche nach Auftrags-Nr. oder Frage..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Suchen
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".json"
                className="hidden"
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <FileUp className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-4">
              <Input
                placeholder="Nr."
                value={editingTask?.id || newTask.id}
                onChange={(e) => editingTask 
                  ? setEditingTask({ ...editingTask, id: formatNumberInput(e.target.value) })
                  : handleIdChange(e.target.value)
                }
                maxLength={7}
              />
              <Input
                placeholder="Frage"
                value={editingTask?.question || newTask.question}
                onChange={(e) => editingTask
                  ? setEditingTask({ ...editingTask, question: e.target.value })
                  : setNewTask({ ...newTask, question: e.target.value })
                }
              />
              <Input
                placeholder="Lösung"
                value={editingTask?.solution || newTask.solution}
                onChange={(e) => editingTask
                  ? setEditingTask({ ...editingTask, solution: e.target.value })
                  : setNewTask({ ...newTask, solution: e.target.value })
                }
              />
              <Input
                placeholder="Raum"
                value={editingTask?.room || newTask.room}
                onChange={(e) => editingTask
                  ? setEditingTask({ ...editingTask, room: e.target.value })
                  : setNewTask({ ...newTask, room: e.target.value })
                }
              />
              <Input
                placeholder="Tipp"
                value={editingTask?.tip || newTask.tip}
                onChange={(e) => editingTask
                  ? setEditingTask({ ...editingTask, tip: e.target.value })
                  : setNewTask({ ...newTask, tip: e.target.value })
                }
              />
              <Button onClick={editingTask ? saveEditedTask : addTask}>
                {editingTask ? "Speichern" : <Plus className="h-4 w-4" />}
              </Button>
            </div>

            <ScrollArea className="h-[400px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nr.</TableHead>
                    <TableHead>Frage</TableHead>
                    <TableHead>Lösung</TableHead>
                    <TableHead>Raum</TableHead>
                    <TableHead>Tipp</TableHead>
                    <TableHead>Medien</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={`task-${task.id}`}>
                      <TableCell>{task.id}</TableCell>
                      <TableCell>{task.question}</TableCell>
                      <TableCell>{task.solution}</TableCell>
                      <TableCell>{task.room}</TableCell>
                      <TableCell>{task.tip}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {task.media?.map((media, index) => (
                            <MediaPreview
                              key={`media-${task.id}-${index}`}
                              type={media.type}
                              src={media.url}
                              className="w-10 h-10 object-cover"
                              onDelete={() => deleteMedia(task.id, index)}
                            />
                          ))}
                          <MediaUpload
                            taskId={task.id}
                            onUpload={(file) => handleMediaUpload(task.id, file)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editTask(task)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDeleteTask(task)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="items">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Input
                placeholder="Suche nach Gegenstand oder Ort..."
                value={searchItemQuery}
                onChange={(e) => setSearchItemQuery(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Suchen
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Gegenstand"
                value={editingSearchItem?.item || newSearchItem.item}
                onChange={(e) => editingSearchItem
                  ? setEditingSearchItem({ ...editingSearchItem, item: e.target.value })
                  : setNewSearchItem({ ...newSearchItem, item: e.target.value })
                }
              />
              <Input
                placeholder="Ort"
                value={editingSearchItem?.location || newSearchItem.location}
                onChange={(e) => editingSearchItem
                  ? setEditingSearchItem({ ...editingSearchItem, location: e.target.value })
                  : setNewSearchItem({ ...newSearchItem, location: e.target.value })
                }
              />
              <Button onClick={editingSearchItem ? saveEditedSearchItem : addSearchItem}>
                {editingSearchItem ? "Speichern" : <Plus className="h-4 w-4" />}
              </Button>
            </div>

            <ScrollArea className="h-[400px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gegenstand</TableHead>
                    <TableHead>Ort</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSearchItems.map((item) => (
                    <TableRow key={`item-${item.item}`}>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editSearchItem(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSearchItem(item.item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}