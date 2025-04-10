
import { ReactNode } from 'react';
import { EditorHeader } from './EditorHeader';
import { BirthPlanSectionProgress } from '../BirthPlanSectionProgress';
import { birthPlanSections } from '../utils/birthPlanSections';
import { EditorTip } from './EditorTip';
import { EditorFooter } from './EditorFooter';
import { BackToTopButton } from '../common/BackToTopButton';

interface EditorLayoutProps {
  children: ReactNode;
  activeSectionIndex: number;
  setActiveSectionIndex: (index: number) => void;
  completedSections: string[];
  goToPreviousSection: () => void;
  goToNextSection: () => void;
  handleSave: () => void;
  onNext: () => void;
  isDirty: boolean;
}

export function EditorLayout({
  children,
  activeSectionIndex,
  setActiveSectionIndex,
  completedSections,
  goToPreviousSection,
  goToNextSection,
  handleSave,
  onNext,
  isDirty
}: EditorLayoutProps) {
  return (
    <div className="animate-fade-in">
      <EditorHeader />
      
      <BirthPlanSectionProgress 
        sections={birthPlanSections}
        currentSectionIndex={activeSectionIndex}
        onSectionClick={setActiveSectionIndex}
        stageType="editor"
        completedSections={completedSections}
        onPrevious={goToPreviousSection}
        onNext={goToNextSection}
      />
      
      {children}
      
      <EditorTip />
      
      <EditorFooter 
        activeSectionIndex={activeSectionIndex}
        birthPlanSectionLength={birthPlanSections.length}
        handleSave={handleSave}
        onNext={onNext}
        setActiveSectionIndex={setActiveSectionIndex}
        isDirty={isDirty}
      />
      
      <BackToTopButton />
    </div>
  );
}
