import React, { useEffect, useState } from 'react';
import { SummaryCard } from '../components/SummaryCard';
import { RequestTable } from '../components/RequestTable';
import { Project } from '../types';
import { fetchProjects } from '../api/client';

export const Dashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await fetchProjects();
                setProjects(data);
            } catch (err) {
                setError('Failed to load projects');
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    const handleViewProject = (project: Project) => {
        console.log('View project', project);
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--color-primary)' }}>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--color-danger)' }}>{error}</div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <header style={{ padding: '2rem 0 3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="animate-fade-in" style={{ marginBottom: '0.5rem' }}>Resource Management</h1>
                        <p className="animate-fade-in" style={{ color: 'var(--color-text-secondary)', animationDelay: '100ms' }}>
                            Track and manage your resource requests efficiently.
                        </p>
                    </div>
                    <div className="animate-fade-in" style={{ animationDelay: '200ms', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'var(--color-primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600
                        }}>
                            RL
                        </div>
                        <div>
                            <div style={{ fontWeight: 500 }}>Raphael Lustig</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Wallet Manager</div>
                        </div>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <SummaryCard title="Total Requests" value="12" color="primary" />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <SummaryCard title="Approved" value="8" color="success" />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <SummaryCard title="Pending" value="3" color="warning" />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
                    <SummaryCard title="Rejected" value="1" color="danger" />
                </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
                <RequestTable projects={projects} onView={handleViewProject} />
            </div>
        </div >
    );
};
