import { Pipe, PipeTransform } from '@angular/core';
import { SecurityQuestionsModel } from '@de-care/data-services';

@Pipe({
    name: 'recoverPasswordQuestions'
})
export class RecoverPasswordQuestionsPipe implements PipeTransform {
    transform(questions: SecurityQuestionsModel[], ...filters: number[]): any {
        return questions.filter(question => {
            return filters.indexOf(question.id) === -1;
        });
    }
}
