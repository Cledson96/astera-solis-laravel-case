<?php

namespace Database\Seeders;

use App\Models\Collection;
use App\Models\Material;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\School;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $schoolSolar = School::updateOrCreate(
                ['inep_code' => '35000001'],
                [
                    'name' => 'Escola Solar Astera',
                    'city' => 'Sao Paulo',
                    'state' => 'SP',
                    'active' => true,
                ],
            );

            $schoolAurora = School::updateOrCreate(
                ['inep_code' => '33000002'],
                [
                    'name' => 'Colegio Aurora Solis',
                    'city' => 'Rio de Janeiro',
                    'state' => 'RJ',
                    'active' => true,
                ],
            );

            $this->seedUsers($schoolSolar, $schoolAurora);
            $this->seedCollections();
        });
    }

    private function seedUsers(School $schoolSolar, School $schoolAurora): void
    {
        $users = [
            [
                'name' => 'Admin Astera',
                'email' => 'admin@astera.test',
                'role' => 'admin',
                'school_id' => null,
            ],
            [
                'name' => 'Editor Solis',
                'email' => 'editor@astera.test',
                'role' => 'editor',
                'school_id' => null,
            ],
            [
                'name' => 'Professor Demo',
                'email' => 'teacher@astera.test',
                'role' => 'teacher',
                'school_id' => $schoolSolar->id,
            ],
            [
                'name' => 'Estudante Demo',
                'email' => 'student@astera.test',
                'role' => 'student',
                'school_id' => $schoolAurora->id,
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    ...$user,
                    'password' => 'password',
                    'email_verified_at' => now(),
                ],
            );
        }
    }

    private function seedCollections(): void
    {
        foreach ($this->collections() as $collectionData) {
            $collection = Collection::updateOrCreate(
                ['slug' => $collectionData['slug']],
                [
                    'title' => $collectionData['title'],
                    'description' => $collectionData['description'],
                    'segment' => $collectionData['segment'],
                    'subject' => $collectionData['subject'],
                    'active' => true,
                ],
            );

            foreach ($collectionData['materials'] as $materialData) {
                Material::updateOrCreate(
                    [
                        'collection_id' => $collection->id,
                        'title' => $materialData['title'],
                    ],
                    [
                        ...$materialData,
                        'collection_id' => $collection->id,
                        'active' => true,
                    ],
                );
            }

            foreach ($collectionData['quizzes'] as $quizData) {
                $quiz = Quiz::updateOrCreate(
                    [
                        'collection_id' => $collection->id,
                        'title' => $quizData['title'],
                    ],
                    [
                        'collection_id' => $collection->id,
                        'title' => $quizData['title'],
                        'description' => $quizData['description'],
                        'passing_score' => $quizData['passing_score'],
                        'active' => true,
                    ],
                );

                foreach ($quizData['questions'] as $questionData) {
                    Question::updateOrCreate(
                        [
                            'quiz_id' => $quiz->id,
                            'statement' => $questionData['statement'],
                        ],
                        [
                            ...$questionData,
                            'quiz_id' => $quiz->id,
                        ],
                    );
                }
            }
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function collections(): array
    {
        return [
            [
                'title' => 'Colecao Solis Infantil',
                'slug' => 'solis-infantil',
                'description' => 'Materiais digitais para leitura, imaginacao e primeiros projetos em sala.',
                'segment' => 'infantil',
                'subject' => 'Linguagem',
                'materials' => [
                    [
                        'title' => 'Livro digital: Historias do Sol',
                        'type' => 'ebook',
                        'summary' => 'Ebook ilustrado para leitura guiada.',
                        'url' => 'https://example.com/solis-infantil/historias-do-sol',
                        'estimated_minutes' => 20,
                    ],
                    [
                        'title' => 'Jogo: Descubra as Letras',
                        'type' => 'game',
                        'summary' => 'Atividade interativa de alfabetizacao.',
                        'url' => 'https://example.com/solis-infantil/descubra-as-letras',
                        'estimated_minutes' => 15,
                    ],
                ],
                'quizzes' => [
                    [
                        'title' => 'Quiz de leitura infantil',
                        'description' => 'Verifica compreensao de texto e vocabulario inicial.',
                        'passing_score' => 70,
                        'questions' => [
                            [
                                'statement' => 'Qual habilidade a leitura guiada mais desenvolve?',
                                'options' => [
                                    'A' => 'Memorizacao de datas',
                                    'B' => 'Compreensao de texto',
                                    'C' => 'Calculo avancado',
                                    'D' => 'Programacao',
                                ],
                                'correct_option' => 'B',
                                'points' => 1,
                            ],
                            [
                                'statement' => 'Qual tipo de material combina com alfabetizacao inicial?',
                                'options' => [
                                    'A' => 'Jogo de letras',
                                    'B' => 'Planilha financeira',
                                    'C' => 'Manual juridico',
                                    'D' => 'Relatorio tecnico',
                                ],
                                'correct_option' => 'A',
                                'points' => 1,
                            ],
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Solis Fundamental Ciencias',
                'slug' => 'solis-fundamental-ciencias',
                'description' => 'Colecao para investigacao cientifica, meio ambiente e experimentos simples.',
                'segment' => 'fundamental',
                'subject' => 'Ciencias',
                'materials' => [
                    [
                        'title' => 'Videoaula: Ciclo da Agua',
                        'type' => 'video',
                        'summary' => 'Aula curta com explicacao visual sobre evaporacao e chuva.',
                        'url' => 'https://example.com/solis-fundamental/ciclo-da-agua',
                        'estimated_minutes' => 12,
                    ],
                    [
                        'title' => 'PDF: Experimento de Germinacao',
                        'type' => 'pdf',
                        'summary' => 'Roteiro pratico para observar crescimento de sementes.',
                        'url' => 'https://example.com/solis-fundamental/germinacao',
                        'estimated_minutes' => 30,
                    ],
                ],
                'quizzes' => [
                    [
                        'title' => 'Simulado de ciencias naturais',
                        'description' => 'Questao sobre ciclo da agua e investigacao cientifica.',
                        'passing_score' => 70,
                        'questions' => [
                            [
                                'statement' => 'No ciclo da agua, a evaporacao acontece quando a agua:',
                                'options' => [
                                    'A' => 'Congela no solo',
                                    'B' => 'Vira vapor com o calor',
                                    'C' => 'Desaparece para sempre',
                                    'D' => 'Se transforma em pedra',
                                ],
                                'correct_option' => 'B',
                                'points' => 1,
                            ],
                            [
                                'statement' => 'Um experimento escolar deve ter:',
                                'options' => [
                                    'A' => 'Pergunta, observacao e registro',
                                    'B' => 'Somente opiniao',
                                    'C' => 'Resposta antes da pergunta',
                                    'D' => 'Nenhum cuidado',
                                ],
                                'correct_option' => 'A',
                                'points' => 1,
                            ],
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Solis Ensino Medio Humanidades',
                'slug' => 'solis-medio-humanidades',
                'description' => 'Materiais de historia, sociedade e interpretacao de fontes.',
                'segment' => 'medio',
                'subject' => 'Historia',
                'materials' => [
                    [
                        'title' => 'Ebook: Fontes Historicas',
                        'type' => 'ebook',
                        'summary' => 'Guia para analisar documentos, imagens e relatos historicos.',
                        'url' => 'https://example.com/solis-medio/fontes-historicas',
                        'estimated_minutes' => 25,
                    ],
                    [
                        'title' => 'PDF: Simulado ENEM Humanidades',
                        'type' => 'pdf',
                        'summary' => 'Lista de questoes contextualizadas para revisao.',
                        'url' => 'https://example.com/solis-medio/simulado-humanidades',
                        'estimated_minutes' => 45,
                    ],
                ],
                'quizzes' => [
                    [
                        'title' => 'Simulado de humanidades',
                        'description' => 'Avaliacao sobre fontes historicas e interpretacao social.',
                        'passing_score' => 70,
                        'questions' => [
                            [
                                'statement' => 'Uma fonte historica pode ser:',
                                'options' => [
                                    'A' => 'Apenas texto oficial',
                                    'B' => 'Documento, imagem, objeto ou relato',
                                    'C' => 'Somente livro didatico',
                                    'D' => 'Apenas filme recente',
                                ],
                                'correct_option' => 'B',
                                'points' => 1,
                            ],
                            [
                                'statement' => 'Ao analisar uma fonte, o estudante deve considerar:',
                                'options' => [
                                    'A' => 'Contexto e autoria',
                                    'B' => 'Somente a cor da pagina',
                                    'C' => 'A resposta mais curta',
                                    'D' => 'A opiniao do primeiro colega',
                                ],
                                'correct_option' => 'A',
                                'points' => 1,
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}
