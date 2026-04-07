import { useState, useEffect } from "react";
import { 
    Plus, 
    Search, 
    Book as BookIcon, 
    Edit, 
    Trash2, 
    ExternalLink, 
    Loader2, 
    LayoutGrid, 
    List as ListIcon, 
    MoreVertical,
    FileText,
    Image as ImageIcon,
    CheckCircle2,
    DollarSign,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { bookService } from "@/services/book.service";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const bookSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    author: z.string().default("Parijat Dave"),
    thumbnail: z.string().url("Please enter a valid cover image URL"),
    pdfUrl: z.string().url("Please enter a valid PDF URL"),
    price: z.preprocess((val) => Number(val), z.number().min(0)),
    isFree: z.boolean().default(false),
});

type BookFormValues = z.infer<typeof bookSchema>;

export default function AdminBooks() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<any | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    const form = useForm<BookFormValues>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: "",
            description: "",
            author: "Parijat Dave",
            thumbnail: "",
            pdfUrl: "",
            price: 0,
            isFree: false,
        },
    });

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await bookService.getAll();
            if (res.status === "success") {
                setBooks(res.data.books);
            }
        } catch (err) {
            console.error("AdminBooks: Failed to fetch", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const onSubmit = async (values: BookFormValues) => {
        try {
            if (editingBook) {
                const res = await bookService.update(editingBook.id, values);
                if (res.status === "success") {
                    toast({ title: "Success", description: "Book updated successfully" });
                    setIsDialogOpen(false);
                    fetchBooks();
                }
            } else {
                const res = await bookService.create(values);
                if (res.status === "success") {
                    toast({ title: "Success", description: "New book added to library" });
                    setIsDialogOpen(false);
                    fetchBooks();
                }
            }
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Failed to save book" });
        }
    };

    const handleEdit = (book: any) => {
        setEditingBook(book);
        form.reset({
            title: book.title,
            description: book.description,
            author: book.author,
            thumbnail: book.thumbnail || "",
            pdfUrl: book.pdfUrl,
            price: book.price,
            isFree: book.isFree,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this book?")) {
            try {
                const success = await bookService.delete(id);
                if (success) {
                    toast({ title: "Deleted", description: "Book removed from library" });
                    fetchBooks();
                }
            } catch (err) {
                toast({ variant: "destructive", title: "Error", description: "Failed to delete" });
            }
        }
    };

    const filteredBooks = books.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">Manage Library</h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
                        <Lock className="h-3 w-3 text-emerald-500" />
                        Exclusive Systematic Growth Frameworks by Parijat Dave
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                        className="rounded-xl border-slate-200"
                    >
                        {viewMode === "grid" ? <ListIcon className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            setEditingBook(null);
                            form.reset();
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                                <Plus className="h-5 w-5" />
                                Add New Book
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] bg-white rounded-3xl border-none shadow-2xl overflow-hidden p-0">
                            <div className="bg-slate-900 px-6 py-10 text-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 -left-10 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
                                </div>
                                <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-xl border border-white/10">
                                    <BookIcon className="h-8 w-8 text-primary" />
                                </div>
                                <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                                    {editingBook ? "Update Book Details" : "Publish New Book"}
                                </DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    Fill in the metadata to secure the framework in our library.
                                </DialogDescription>
                            </div>
                            
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-widest">Book Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., The Systematic Growth Framework" className="rounded-xl border-slate-200 focus:ring-primary/20 h-12" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="What will the reader learn?" className="rounded-xl border-slate-200 focus:ring-primary/20 h-12" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="thumbnail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cover Image URL</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <ImageIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 px-0.5" />
                                                            <Input placeholder="https://..." className="rounded-xl border-slate-200 pl-11 h-12" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="pdfUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vault PDF URL</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <FileText className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 px-0.5" />
                                                            <Input placeholder="https://..." className="rounded-xl border-slate-200 pl-11 h-12" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="space-y-1">
                                            <FormLabel className="text-sm font-bold text-slate-900">Paid Module</FormLabel>
                                            <p className="text-xs text-slate-500">Toggle off for free access</p>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="isFree"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Switch
                                                            checked={!field.value}
                                                            onCheckedChange={(checked) => field.onChange(!checked)}
                                                            className="data-[state=checked]:bg-primary"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {!form.watch("isFree") && (
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem className="animate-in slide-in-from-top-2 duration-300">
                                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-widest">Access Fee (INR)</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-3.5 text-slate-900 font-bold">₹</span>
                                                            <Input type="number" className="rounded-xl border-slate-200 pl-8 h-12 font-bold" {...field} />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    <DialogFooter className="pt-4 border-t border-slate-100">
                                        <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-12 px-6 font-bold text-slate-500">Cancel</Button>
                                        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-xl px-10 h-12 font-bold shadow-lg shadow-primary/10">
                                            {editingBook ? "Save Changes" : "Confirm Publication"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Search & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <Input 
                        placeholder="Search by title or author..." 
                        className="pl-12 h-12 rounded-2xl border-none shadow-sm bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="bg-emerald-500 p-4 rounded-2xl flex items-center justify-between text-white shadow-lg shadow-emerald-500/10">
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Library</p>
                        <p className="text-2xl font-bold">{books.length} Books</p>
                    </div>
                    <BookIcon className="h-8 w-8 opacity-40 shrink-0" />
                </div>
            </div>

            {/* Content View */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-slate-500 font-medium">Opening Library Database...</p>
                </div>
            ) : filteredBooks.length > 0 ? (
                viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredBooks.map((book) => (
                            <Card key={book.id} className="group overflow-hidden bg-white border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl flex flex-col h-full">
                                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                                    {book.thumbnail ? (
                                        <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center"><BookIcon className="h-12 w-12 text-slate-300" /></div>
                                    )}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex flex-col gap-2">
                                            <Button size="icon" variant="secondary" className="rounded-full h-9 w-9 bg-white/90 backdrop-blur-sm shadow-xl" onClick={() => handleEdit(book)}><Edit className="h-4 w-4" /></Button>
                                            <Button size="icon" variant="destructive" className="rounded-full h-9 w-9 shadow-xl" onClick={() => handleDelete(book.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 left-3">
                                        <Badge className={cn("px-2.5 py-1 text-[10px] font-bold uppercase border-none", book.isFree ? "bg-emerald-500" : "bg-primary")}>
                                            {book.isFree ? "Free" : `₹${book.price}`}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader className="p-5 flex-1">
                                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight line-clamp-2">{book.title}</h3>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Book Item</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Type</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Access Fee</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Added On</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredBooks.map((book) => (
                                    <tr key={book.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-10 flex-shrink-0 bg-slate-100 rounded-sm overflow-hidden shadow-sm">
                                                    {book.thumbnail && <img src={book.thumbnail} className="h-full w-full object-cover" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 truncate max-w-[300px]">{book.title}</p>
                                                    <p className="text-xs text-slate-500">{book.author}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Badge variant="outline" className={cn("rounded-lg border-none px-3 font-bold", book.isFree ? "bg-emerald-50 text-emerald-600" : "bg-primary/5 text-primary")}>
                                                {book.isFree ? "Public Content" : "Premium Module"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-sm text-slate-900">
                                            {book.isFree ? "FREE" : `₹${book.price}`}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                                            {new Date(book.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-white hover:text-primary hover:shadow-sm" onClick={() => handleEdit(book)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-500" onClick={() => handleDelete(book.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">No books found</h3>
                    <p className="text-slate-500 text-sm">Start building your systematic library by adding your first book.</p>
                </div>
            )}
        </div>
    );
}
