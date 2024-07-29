import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'questionsAvailableFilter'
})
export class QuestionsAvailableFilterPipe implements PipeTransform {
    transform(questions: { id: number; question: string }[], selectedId: number, filters: number[]): any {
        const idsAlreadyUsed = filters.filter(i => i !== selectedId);
        return questions.filter(question => {
            return idsAlreadyUsed.indexOf(question.id) === -1;
        });
    }
}
