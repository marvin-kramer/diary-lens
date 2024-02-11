'use client'
import React, {useEffect, useState} from 'react';
import {Tag} from "@/types/diary";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {Command as CommandPrimitive} from "cmdk"
import {
    CommandDialog,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {createClient} from "@/utils/supabase/client";
import {PlusCircle, Trash2} from "lucide-react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TagSelect = ({initialSelectedTag, diary_id}: { initialSelectedTag: Tag[], diary_id: string }) => {
    const supabase = createClient()
    const [inputActive, setInputActive] = useState(false)
    const [currentlySelectedTags, setCurrentlySelectedTags] = useState(initialSelectedTag)
    const [currentInputValue, setCurrentInputValue] = useState("")
    const [userTags, setUserTags] = useState<Tag[]>([])

    useEffect(() => {
        setUserTagData()
    }, [inputActive]);

    async function setUserTagData() {
        const {data} = await supabase.from("tag").select()
        if (data) setUserTags(data as Tag[])
        else setUserTags([])
    }

    async function setSelectedTagData() {
        const {data, error} = await supabase.from("diary_tag").select(`
            diary_id,
            tag ( id, created_at, user_id, name )
        `).eq("diary_id", diary_id).order("created_at")
        const tags = data?.map(tag => tag.tag as unknown as Tag)
        if (tags) setCurrentlySelectedTags(tags)
    }

    async function addTagToDiary(tag: Tag) {
        console.log("on add tag:", tag)
        setCurrentInputValue("")
        const {error} = await supabase.from("diary_tag").upsert({diary_id: diary_id, tag_id: tag.id})
        if (error) console.log(error)
        setUserTagData()
        setSelectedTagData()
    }

    async function createNewTag(name: string) {
        const {error, data} = await supabase.from("tag").insert({name: name}).select()
        addTagToDiary(data?.at(0) as Tag)
    }

    async function checkForBackKey(event: React.KeyboardEvent<HTMLInputElement>) {
        if (currentInputValue === "" && event.key === "Backspace" && currentlySelectedTags.length > 0) {
            setCurrentlySelectedTags(prevState => prevState.slice(0, currentlySelectedTags.length - 1))
            const lastTag = currentlySelectedTags[currentlySelectedTags.length - 1]
            await supabase.from("diary_tag").delete().match({diary_id: diary_id, tag_id: lastTag.id})
            setSelectedTagData()
        }
    }

    async function deleteTag(tag: Tag) {
        const {error} = await supabase.from("tag").delete().eq("id", tag.id)
        setUserTagData()
        setSelectedTagData()
    }


    return (
        <>
            <div
                className={cn("flex flex-wrap gap-2 p-2 rounded-md hover:bg-secondary/60 hover:cursor-pointer w-full")}
                onClick={() => setInputActive(true)}
            >
                {currentlySelectedTags.length > 0 ? currentlySelectedTags.map(tag => (
                    <Badge key={tag.id}>{tag.name}</Badge>
                )) : <p className={"text-muted-foreground"}>Add tags to your diary...</p>}
            </div>

            <CommandDialog open={inputActive} onOpenChange={setInputActive}>
                <div className={"flex flex-wrap gap-2 items-center border-b p-3 pr-11"}>
                    {currentlySelectedTags.map(tag => (
                        <Badge key={tag.id} className={"w-fit"}>{tag.name}</Badge>
                    ))}
                    <CommandPrimitive.Input
                        onKeyDown={(event) => checkForBackKey(event)}
                        onValueChange={setCurrentInputValue}
                        value={currentInputValue}
                        className={"!h-fit min-w-4 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"}
                    />
                </div>
                <CommandList onSelect={(event) => console.log(event)}>
                    <CommandGroup heading="Suggestions">
                        {userTags.map(tag => (
                            <CommandItem
                                key={tag.id}
                                onSelect={() => addTagToDiary(tag)}
                                className={"group"}
                            >
                                <span className={"w-full overflow-hidden text-ellipsis text-nowrap"}>{tag.name}</span>
                                <DeleteDialog tag={tag} onDelete={deleteTag}/>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    {currentInputValue.trim().length > 0 &&
                        <CommandGroup heading="Neu">
                            <CommandItem className={"flex gap-2"} onSelect={() => createNewTag(currentInputValue.trim())} value={currentInputValue.trim()}>
                                <PlusCircle/>
                                <span className={"w-full overflow-hidden text-nowrap text-ellipsis"}>{currentInputValue.trim()}</span>
                            </CommandItem>
                        </CommandGroup>
                    }
                </CommandList>
            </CommandDialog>
        </>
    );
};


const DeleteDialog = ({onDelete, tag}: { tag: Tag, onDelete: (tag: Tag) => void }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Trash2
                className={"hidden group-aria-[selected]:block hover:cursor-pointer"}
                onClick={(event) => {
                    event.stopPropagation()
                    setIsOpen(true)
                }}
            />
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this tag
                            and remove it from every diary entry.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={(event) => {
                            event.stopPropagation()
                            onDelete(tag)
                        }}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

function contains(tags: Tag[], name: string): boolean {
    const foundTag = tags.find(value => value.name === name)
    console.log(foundTag)
    console.log(name)
    return !!foundTag
}

export default TagSelect;