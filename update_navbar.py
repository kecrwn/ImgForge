import re

with open('src/components/layout/Navbar.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Search, Sun, Moon, Monitor, Menu, X, Globe, ChevronDown, Flame, FileImage, FileText, Settings, Grid, History } from 'lucide-react';",
"import { Search, Sun, Moon, Monitor, Menu, X, Globe, ChevronDown, Flame, FileImage, FileText, Settings, Grid, History, ChevronUp } from 'lucide-react';\nimport * as Icons from 'lucide-react';\nimport { TOOLS } from '../../config/tools';")

nav_links_new = """const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (Icons as any)[name] || Icons.Code;
  return <Icon className={className} />;
};

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Compress', path: '/compress', hasMegaMenu: true, categories: ['compression', 'exact-size'] },
  { name: 'Resize', path: '/resize', hasMegaMenu: true, categories: ['resize', 'official-sizes', 'passport-id', 'social-media'] },
  { name: 'Convert', path: '/convert', hasMegaMenu: true, categories: ['conversions'] },
  { name: 'PDF Tools', path: '/pdf-tools', hasMegaMenu: true, categories: ['pdf-tools', 'image-to-pdf'] },
  { name: 'Edit', path: '/edit', hasMegaMenu: true, categories: ['basic-editing', 'effects', 'dpi-quality', 'gif-tools'] },
  { name: 'All Tools', path: '/tools' },
];"""

content = re.sub(r"const NAV_LINKS = \[[^\]]*\];", nav_links_new, content, flags=re.DOTALL)

# Update MobileDrawer state
content = content.replace("const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);", 
"const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);\n  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);")

content = content.replace("setMobileMenuOpen(false);\n    setActiveMegaMenu(null);",
"setMobileMenuOpen(false);\n    setActiveMegaMenu(null);\n    setExpandedMobileMenu(null);")

# Update Mega Menu Dropdown content
mega_menu_old = """{/* Dummy tools for mega menu */}
                          {[1,2,3,4].map(i => (
                            <Link key={i} to={`${link.path}-tool-${i}`} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                                <FileImage className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">Tool {i}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Short description</div>
                              </div>
                            </Link>
                          ))}"""

mega_menu_new = """{(() => {
                            const categoryTools = TOOLS.filter(t => link.categories?.includes(t.category)).slice(0, 8);
                            return categoryTools.map(tool => (
                              <Link key={tool.slug} to={`/tool/${tool.slug}`} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" style={{ color: tool.accentColor }}>
                                  <DynamicIcon name={tool.icon} className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{tool.name}</div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{tool.description}</div>
                                </div>
                              </Link>
                            ));
                          })()}
                          <div className="col-span-2 pt-2 pb-1 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                            <Link to={link.path} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">View all {link.name} tools &rarr;</Link>
                          </div>"""

content = content.replace(mega_menu_old, mega_menu_new)

# Update Mobile Menu Links to use Accordions
mobile_menu_old = """{NAV_LINKS.map(link => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="px-4 py-3 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-between"
                    >
                      {link.name}
                      {link.hasMegaMenu && <ChevronDown className="w-4 h-4 opacity-50" />}
                    </Link>
                  ))}"""

mobile_menu_new = """{NAV_LINKS.map(link => (
                    <div key={link.name}>
                      <div 
                        className="px-4 py-3 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-between cursor-pointer"
                        onClick={() => {
                          if (link.hasMegaMenu) {
                            setExpandedMobileMenu(expandedMobileMenu === link.name ? null : link.name);
                          } else {
                            window.location.href = link.path;
                          }
                        }}
                      >
                        <Link to={link.hasMegaMenu ? '#' : link.path} onClick={(e) => {
                          if(link.hasMegaMenu) {
                            e.preventDefault();
                          }
                        }}>{link.name}</Link>
                        {link.hasMegaMenu && (expandedMobileMenu === link.name ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />)}
                      </div>
                      <AnimatePresence>
                        {link.hasMegaMenu && expandedMobileMenu === link.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-6 pr-2 py-2 flex flex-col gap-1">
                              <Link
                                to={link.path}
                                className="px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
                              >
                                View all {link.name} tools
                              </Link>
                              {TOOLS.filter(t => link.categories?.includes(t.category)).slice(0, 5).map(tool => (
                                <Link
                                  key={tool.slug}
                                  to={`/tool/${tool.slug}`}
                                  className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                                >
                                  <DynamicIcon name={tool.icon} className="w-4 h-4" />
                                  {tool.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}"""

content = content.replace(mobile_menu_old, mobile_menu_new)

with open('src/components/layout/Navbar.tsx', 'w') as f:
    f.write(content)
