import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Book as BookIcon, GraduationCap, Lock, Loader2, Info, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { bookService } from "@/services/book.service";
import { useAuthStore } from "@/store/auth";

export default function Books() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const res = await bookService.getAll();
                if (res && res.books) {
                    setBooks(res.books);
                }
            } catch (err) {
                console.error("Failed to fetch books", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleRead = (id: string) => {
        navigate(`/books/${id}`);
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Section */}
            <section className="py-24 bg-[#0f172a] border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>
                <div className="container px-4 mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                        <BookIcon className="h-3 w-3" />
                        Our Books
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                        Knowledge You Can <span className="text-primary italic">Apply Today</span>
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                        Parijat Dave's books are not motivational reads — they are structured application guides. Each one is built around the same 48-hour rule: every concept must be applied before the next chapter is read.
                    </p>
                </div>
            </section>

            {/* Books Grid */}
            <div className="container px-4 mx-auto py-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-slate-500 font-medium tracking-wide">Opening our library...</p>
                    </div>
                ) : books.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
                        {books.map((book) => (
                            <Card key={book.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-none bg-slate-50 relative flex flex-col h-full">
                                <div className="relative aspect-[3/4] overflow-hidden bg-slate-200">
                                    {book.thumbnail ? (
                                        <img
                                            src={book.thumbnail}
                                            alt={book.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                            <BookIcon className="h-20 w-20 text-slate-600" />
                                        </div>
                                    )}

                                    {/* Overlay for price/badge */}
                                    <div className="absolute top-4 left-4">
                                        <Badge className={`px-3 py-1 border-none shadow-lg backdrop-blur-md ${book.isFree ? 'bg-emerald-500/90 text-white' : 'bg-primary/90 text-white'}`}>
                                            {book.isFree ? 'Free Access' : `₹${book.price}`}
                                        </Badge>
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                        <Button
                                            className="w-full bg-white text-slate-900 hover:bg-primary hover:text-white font-bold transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                                            onClick={() => handleRead(book.id)}
                                        >
                                            <ArrowRight className="h-4 w-4 mr-2" />
                                            {book.isFree ? 'Read Now' : 'Access Book'}
                                        </Button>
                                    </div>
                                </div>

                                <CardHeader className="flex-1 space-y-1 p-6">
                                    <div className="text-xs font-bold text-primary uppercase tracking-widest">{book.author}</div>
                                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                                        {book.title}
                                    </CardTitle>
                                    <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed mt-2">
                                        {book.description}
                                    </p>
                                </CardHeader>

                                <CardFooter className="p-6 pt-0 border-t border-slate-200/50 flex justify-between items-center text-xs font-bold text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <Lock className="h-3 w-3" />
                                        <span>Secure Online Reading</span>
                                    </div>
                                    <div className="text-slate-300">|</div>
                                    <div className="flex items-center gap-1.5">
                                        <GraduationCap className="h-3 w-3" />
                                        <span>SES Exclusive</span>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 max-w-2xl mx-auto">
                        <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Info className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Library Coming Soon</h3>
                        <p className="text-slate-500 mb-8 px-6 leading-relaxed">
                            Parijat Dave is curating a collection of systematic growth frameworks.
                            Check back soon to explore our exclusive publications.
                        </p>
                        <Button asChild variant="outline" className="rounded-full px-8 hover:bg-primary hover:text-white transition-all">
                            <Link to="/courses">Explore Existing Courses</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
