import React from 'react';
import { Project } from '../types';

interface RequestTableProps {
    projects: Project[];
    onView: (project: Project) => void;
}

export const RequestTable: React.FC<RequestTableProps> = ({ projects, onView }) => {
    return (
        <div className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>My Requests</h3>
                <button className="btn btn-primary" onClick={() => { }}>
                    + New Project
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Project Name</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Center / Branch</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Last Updated</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                    No requests found. Create a new project to get started.
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => (
                                <tr key={project.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{project.name}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)' }}>
                                        {project.center || '-'} / {project.branch || '-'}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: project.status === 'RESOLVED' ? '#dcfce7' : '#e0f2fe',
                                            color: project.status === 'RESOLVED' ? '#166534' : '#0369a1'
                                        }}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                        {new Date(project.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <button
                                            className="btn btn-outline"
                                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                                            onClick={() => onView(project)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
