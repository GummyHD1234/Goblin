"use client";

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { FileDown, FileUp } from "lucide-react";
import { Keypad } from "@/components/keypad";
import { TaskEditor } from "@/components/task-editor";
import { formatTaskNumber } from "@/lib/utils";
import { ChapterNavigation } from "@/components/chapter-navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaPreview } from "@/components/media-preview";
import { useToast } from "@/components/ui/use-toast";
import { VideoPlayer } from "@/components/video-player";
import { Header } from "@/components/header";
import { LogoUploadDialog } from "@/components/logo-upload-dialog";

const initialTasks = [
  { id: "1.01.01", question: "Wie lautet der Name des Hotels?", solution: "Hotel Hügelton", room: "-", tip: "Suche neben einer Tür", key: "-", media: [] },
  { id: "1.01.02", question: "Wie heißt das Schmuckgeschäft?", solution: "Glitzerglanz Juwelen", room: "-", tip: "Suche neben einer Tür", key: "-", media: [] },
];

const initialSearchItems = [
  { item: "Flauschiges Handtuch", location: "Gasthaus zum korrupten Hirsch" },
  { item: "Goldene Gurke", location: "Gasthaus zum korrupten Hirsch" },
];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchItems, setSearchItems] = useState(initialSearchItems);
  const [taskNumber, setTaskNumber] = useState("");
  const [currentTask, setCurrentTask] = useState<typeof initialTasks[0] | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showLogoUpload, setShowLogoUpload] = useState(false);
  const tasksRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    const formattedNumber = formatTaskNumber(taskNumber);
    
    if (formattedNumber === "6.07.24") {
      setShowEasterEgg(true);
      return;
    }

    if (formattedNumber === "8.88.88") {
      setShowLogoUpload(true);
      return;
    }

    const task = tasks.find(t => t.id === formattedNumber);
    setCurrentTask(task || null);
  };

  const handleChapterSelect = (chapter: number) => {
    const firstTaskInChapter = tasks.find(task => task.id.startsWith(`${chapter}.`));
    if (firstTaskInChapter) {
      const element = document.getElementById(`task-${firstTaskInChapter.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogoUploaded = () => {
    window.location.reload();
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const [aChap, aSec, aNum] = a.id.split('.').map(Number);
    const [bChap, bSec, bNum] = b.id.split('.').map(Number);
    if (aChap !== bChap) return aChap - bChap;
    if (aSec !== bSec) return aSec - bSec;
    return aNum - bNum;
  });

  return (
    <main className="min-h-screen p-4 md:p-8">
      <Card className="max-w-7xl mx-auto">
        <CardContent className="p-6">
          <Header />

          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="search">Suche</TabsTrigger>
              <TabsTrigger value="all">Alle Aufträge</TabsTrigger>
              <TabsTrigger value="wanted">Gesucht</TabsTrigger>
              <TabsTrigger value="editor">Editor</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-6">
              <div className="grid gap-6">
                <div className="flex gap-6">
                  <div className="flex-1">
                    <Keypad value={taskNumber} onChange={setTaskNumber} onSearch={handleSearch} />
                  </div>
                  {currentTask?.media && currentTask.media.length > 0 && (
                    <div className="flex-1">
                      {currentTask.media.map((media, index) => (
                        <MediaPreview
                          key={index}
                          type={media.type}
                          src={media.url}
                          className="w-full max-h-[300px] object-contain"
                          autoPlay
                          muted
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {currentTask && (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nr.</TableHead>
                          <TableHead>Frage</TableHead>
                          <TableHead>Lösung</TableHead>
                          <TableHead>Raum</TableHead>
                          <TableHead>Tipp</TableHead>
                          <TableHead>Schlüssel</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>{currentTask.id}</TableCell>
                          <TableCell>{currentTask.question}</TableCell>
                          <TableCell>{currentTask.solution}</TableCell>
                          <TableCell>{currentTask.room}</TableCell>
                          <TableCell>{currentTask.tip}</TableCell>
                          <TableCell>{currentTask.key}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <div className="text-2xl font-bold text-center">
                      Lösung: {currentTask.solution}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="all">
              <div className="flex gap-4">
                <div className="w-48 flex-shrink-0">
                  <ChapterNavigation onChapterSelect={handleChapterSelect} />
                </div>
                <ScrollArea className="h-[600px] flex-grow" ref={tasksRef}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nr.</TableHead>
                        <TableHead>Frage</TableHead>
                        <TableHead>Lösung</TableHead>
                        <TableHead>Raum</TableHead>
                        <TableHead>Tipp</TableHead>
                        <TableHead>Schlüssel</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedTasks.map((task) => (
                        <TableRow key={task.id} id={`task-${task.id}`}>
                          <TableCell>{task.id}</TableCell>
                          <TableCell>{task.question}</TableCell>
                          <TableCell>{task.solution}</TableCell>
                          <TableCell>{task.room}</TableCell>
                          <TableCell>{task.tip}</TableCell>
                          <TableCell>{task.key}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="wanted">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gegenstand</TableHead>
                    <TableHead>Ort</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchItems.map((item) => (
                    <TableRow key={item.item}>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{item.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="editor">
              <TaskEditor
                tasks={tasks}
                searchItems={searchItems}
                onTasksChange={setTasks}
                onSearchItemsChange={setSearchItems}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {showEasterEgg && (
        <VideoPlayer
          src="/easter-egg.mp4"
          onClose={() => setShowEasterEgg(false)}
        />
      )}
      <LogoUploadDialog 
        open={showLogoUpload}
        onOpenChange={setShowLogoUpload}
        onLogoUploaded={handleLogoUploaded}
      />
    </main>
  );
}