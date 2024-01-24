"use client"
import React from 'react';
import {Button} from "@/components/ui/button";
import {createClient} from "@/utils/supabase/client";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useToast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";

const DeleteConfirmationDialog = ({className, diaryId}: { className?: string, diaryId: string }) => {
    const {toast} = useToast()
    const router = useRouter()

    async function handleDeletion() {
        const supabase = createClient()
        const {error} = await supabase.from("diary").delete().eq("id", diaryId)
        if (error) {
            toast({
                title: "An error occurred",
                description: "An error occurred while deleting your diary entry. Please try again later.",
                variant: "destructive"
            })
        } else {
            toast({
                title: "Deletion successful",
                description: "Your diary entry was successfully deleted."
            })

            router.push("/gallery")
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className={className} variant={"destructive"}>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this diary entry
                        and remove your video from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeletion}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmationDialog;