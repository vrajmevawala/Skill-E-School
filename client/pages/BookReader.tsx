import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book as BookIcon, ChevronLeft, Loader2, AlertCircle, ShieldAlert, Lock, Info } from "lucide-react";
import { bookService } from "@/services/book.service";
import { useAuthStore } from "@/store/auth";

export default function BookReader() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [book, setBook] = useState<any>(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBookAndAccess = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [bookRes, accessRes] = await Promise.all([
                    bookService.getById(id),
                    bookService.checkAccess(id)
                ]);

                if (bookRes && bookRes.book) {
                    setBook(bookRes.book);
                }

                if (accessRes && accessRes.hasAccess !== undefined) {
                    setHasAccess(accessRes.hasAccess);
                }
            } catch (err) {
                console.error("Failed to load book reader", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookAndAccess();
    }, [id]);

    const handlePurchase = async () => {
        if (!user) {
            navigate("/login", { state: { from: `/books/${id}` } });
            return;
        }

        try {
            setLoading(true);
            const res = await bookService.purchase(id!);
            if (res.status === "success") {
                setHasAccess(true);
            }
        } catch (err) {
            console.error("Purchase failed", err);
        } finally {
            setLoading(false);
        }
    };

    // Security: Prevent right-click, Save-as shortcuts, and printing
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent Ctrl+S (Save), Ctrl+P (Print), Ctrl+U (Source), Ctrl+Shift+I (DevTools)
            if (e.ctrlKey && (e.key === "s" || e.key === "p" || e.key === "u") || (e.ctrlKey && e.shiftKey && e.key === "i")) {
                e.preventDefault();
                alert("This book is protected. Downloading is not allowed.");
            }
        };

        window.addEventListener("contextmenu", handleContextMenu);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("contextmenu", handleContextMenu);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-6">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-slate-400 text-lg font-bold tracking-widest uppercase">Opening Vault...</p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
                <AlertCircle className="h-20 w-20 text-red-500/20 mb-6" />
                <h1 className="text-3xl font-bold text-white mb-2">Book Not Found</h1>
                <p className="text-slate-400 mb-8">The book you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => navigate("/books")} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Library
                </Button>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
                <div className="w-full max-w-xl bg-slate-900/50 backdrop-blur-3xl p-12 rounded-[2rem] border border-white/5 shadow-2xl text-center space-y-8">
                    <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
                        <Lock className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-white tracking-tight">{book.title}</h2>
                        <p className="text-slate-400 leading-relaxed px-6">
                            This is a <span className="text-primary font-bold">Premium Module</span>. 
                            Purchase access to unlock this systematic framework and read it directly in your high-security browser vault.
                        </p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="text-left">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Access Fee</p>
                            <p className="text-2xl font-bold text-white">₹{book.price}</p>
                        </div>
                        <Button onClick={handlePurchase} className="px-8 bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl">
                            Unlock Full Access
                        </Button>
                    </div>
                    
                    <Button variant="ghost" onClick={() => navigate("/books")} className="text-slate-500 hover:text-white transition-colors">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Explore Other Titles
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-950 flex flex-col overflow-hidden select-none">
            {/* Header / Toolbar */}
            <div className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between z-50">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate("/books")} 
                        className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-sm font-bold text-white line-clamp-1">{book.title}</h1>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{book.author}</span>
                             <span className="text-slate-700">|</span>
                             <span className="text-[10px] font-medium text-emerald-500/80 tracking-wide flex items-center gap-1">
                                <ShieldAlert className="h-2.5 w-2.5" />
                                Secure Read-Only Vault
                             </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-slate-800 border-none text-slate-400 font-bold hidden md:inline-flex">
                        SES Systematic Learning
                    </Badge>
                </div>
            </div>

            {/* Reader Area */}
            <div className="flex-1 bg-slate-800/20 relative flex justify-center">
                <div 
                    ref={containerRef}
                    className="w-full max-w-5xl h-full bg-white relative shadow-2xl overflow-hidden"
                >
                    {/* Security Watermark on top of content */}
                    <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] flex items-center justify-center flex-wrap gap-20 select-none overflow-hidden rotate-[-45deg]">
                        {Array.from({ length: 100 }).map((_, i) => (
                            <span key={i} className="text-slate-900 text-sm font-bold tracking-widest uppercase">
                                Skill E-School Property - {user?.email || "Restricted View"}
                            </span>
                        ))}
                    </div>

                    {/* PDF Embed / Iframe */}
                    <iframe
                        src={`${book.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-full border-none"
                        title={book.title}
                        onLoad={() => console.log("PDF Loaded")}
                    />
                    
                    {/* Shield Overlay to block some interactions */}
                    <div className="absolute inset-x-0 top-0 h-10 z-20" />
                    <div className="absolute inset-x-0 bottom-0 h-10 z-20" />
                </div>
            </div>

            {/* Footer / Protection Notice */}
            <div className="h-10 bg-slate-900/40 px-6 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest border-t border-white/5">
                <div className="flex items-center gap-2">
                    <Info className="h-3 w-3 text-primary/50" />
                    <span>Download and Printing are disabled for IP Protection</span>
                </div>
                <div className="text-slate-700">&copy; 2026 Skill E-School by Parijat Dave</div>
            </div>
        </div>
    );
}
