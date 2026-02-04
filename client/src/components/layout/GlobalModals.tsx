import { useModal } from '../../contexts/ModalContext';
import { useRefresh } from '../../contexts/RefreshContext';
import CreateProjectModal from '../projects/CreateProjectModal';
import CreateDemandModal from '../projects/CreateDemandModal';
import { createProject, createDemand } from '../../api/apiService';
import type { CreateProjectPayload, CreateDemandPayload } from '../../api/types';

export default function GlobalModals() {
    const { activeModal, closeModal } = useModal();
    const { triggerRefreshProjects, triggerRefreshDemands } = useRefresh();

    async function handleCreateProject(payload: CreateProjectPayload) {
        try {
            await createProject(payload);
            triggerRefreshProjects();
            closeModal();
        } catch (error) {
            console.error('Failed to create project', error);
            // Ideally show a toast notification here
        }
    }

    async function handleCreateDemand(payload: CreateDemandPayload) {
        try {
            await createDemand(payload);
            triggerRefreshDemands();
            closeModal();
            // Demands list also depends on projects, and creating a demand might update project stats if visualized,
            // but primarily it updates demands list.
        } catch (error) {
            console.error('Failed to create demand', error);
        }
    }

    return (
        <>
            <CreateProjectModal
                isOpen={activeModal === 'project'}
                onClose={closeModal}
                onSubmit={handleCreateProject}
            />
            <CreateDemandModal
                isOpen={activeModal === 'demand'}
                onClose={closeModal}
                onSubmit={handleCreateDemand}
            />
        </>
    );
}
