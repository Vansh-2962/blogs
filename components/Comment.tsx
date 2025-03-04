import React, { useState } from "react";
import Author from "./Author";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, EllipsisVertical, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";

type CommentPageProps = {
  content: string;
  setDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  setEdited: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  author: {
    name: string;
    email: string;
    profilePic: string | null;
  };
  createdAt: Date;
};

const CommentPage = ({
  content,
  author,
  createdAt,
  id,
  setEdited,
  setDeleted,
}: CommentPageProps) => {
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedComment, setEditedComment] = useState(content);

  const handleDeleteComment = async (id: string) => {
    try {
      setDeleting(true);
      await axios.delete(`/api/blogs/comment/delete/${id}`);

      setDeleted(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.message || "Something went wrong!");
      } else {
        toast("Something went wrong!");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleEditComment = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    try {
      setEditing(true);
      const response = await axios.put(`/api/blogs/comment/edit/${id}`, {
        newComment: editedComment,
      });

      setEdited(true);
      toast(response.data.msg);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.message || "Something went wrong!");
      } else {
        toast("Something went wrong!");
      }
    } finally {
      setEditing(false);
    }
  };

  return (
    <div>
      <div className="flex md:flex-row flex-col md:items-end md:justify-between gap-2 md:gap-0">
        <Author
          name={author?.name}
          profilePic={author?.profilePic as string}
          email={author?.email}
        />
        <p className="text-xs md:px-0 px-11 text-zinc-500">
          commented on{" "}
          <span className="font-semibold dark:text-white/70">
            {createdAt.toLocaleDateString()}
          </span>
        </p>
      </div>
      <div className="pl-11  text-sm md:mt-3 mt-5 dark:text-zinc-300 text-zinc-700 flex items-center justify-between gap-2 ">
        {edit ? (
          <form
            onSubmit={(e) => handleEditComment(e, id)}
            className="w-full focus:outline-none focus:ring-1 focus:p-2 flex items-center gap-1"
          >
            <input
              type="text"
              autoFocus={edit}
              onBlur={() => setEdit(false)}
              className="w-full focus:outline-none focus:ring-1 focus:p-2 focus:ring-green-500/20 rounded-lg"
              value={editedComment}
              onChange={(e) => {
                setEditedComment(e.target.value);
              }}
            />
            {edit && (
              <>
                <button
                  className="ml-2 font-semibold bg-green-500/10 p-3 rounded-full hover:bg-green-500/20 transition-all duration-300 ease-in-out"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <small>
                    {editing ? (
                      <LoaderCircle className="h-4 w-4 animate-spin text-green-500" />
                    ) : (
                      <Check className="w-4 h-4 text-green-500  " />
                    )}
                  </small>
                </button>
              </>
            )}
          </form>
        ) : (
          <span className="flex-1 ">{content}</span>
        )}

        <Popover>
          <PopoverTrigger className="cursor-pointer">
            <EllipsisVertical className={`w-4 h-4 ${edit && "hidden"}`} />
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <Button
              onClick={() => setEdit(true)}
              variant={"outline"}
              className="w-full"
              size={"sm"}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDeleteComment(id)}
              variant={"destructive"}
              className="w-full mt-2"
              size={"sm"}
            >
              {deleting ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>Delete</>
              )}
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default CommentPage;
