CREATE TABLE IF NOT EXISTS public.students
    (
        student_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
        first_name_en text COLLATE pg_catalog."default",
        middle_name_en text COLLATE pg_catalog."default",
        last_name_en text COLLATE pg_catalog."default",
        phone_number text COLLATE pg_catalog."default",
        email text COLLATE pg_catalog."default",
        student_country text COLLATE pg_catalog."default",
        birth_of_date date,
        CONSTRAINT users_pkey PRIMARY KEY (student_id)
    );

CREATE TABLE IF NOT EXISTS public.guradians
    (
        id integer NOT NULL DEFAULT nextval('guadians_id_seq'::regclass),
        guradian_name text COLLATE pg_catalog."default",
        guradian_number text COLLATE pg_catalog."default",
        guradian_relationship text COLLATE pg_catalog."default",
        student_id integer NOT NULL,
        CONSTRAINT guadians_pkey PRIMARY KEY (id),
        CONSTRAINT student_fk FOREIGN KEY (student_id)
            REFERENCES public.students (student_id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS public.tests
    (
        id integer NOT NULL DEFAULT nextval('test_id_seq'::regclass),
        test_name text COLLATE pg_catalog."default" NOT NULL,
        test_description text COLLATE pg_catalog."default",
        link text COLLATE pg_catalog."default",
        img_src text COLLATE pg_catalog."default",
        CONSTRAINT entry_test_pkey PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS public.questions
    (
        id integer NOT NULL DEFAULT nextval('questions_id_seq'::regclass),
        question_text text COLLATE pg_catalog."default" NOT NULL,
        question_type text COLLATE pg_catalog."default" NOT NULL,
        test_id integer NOT NULL,
        question_format text COLLATE pg_catalog."default",
        correct_answer text COLLATE pg_catalog."default",
        CONSTRAINT questions_pkey PRIMARY KEY (id),
        CONSTRAINT tests_fk FOREIGN KEY (test_id)
            REFERENCES public.tests (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )

CREATE TABLE IF NOT EXISTS public.options
    (
        id integer NOT NULL DEFAULT nextval('options_id_seq'::regclass),
        option_text text COLLATE pg_catalog."default" NOT NULL,
        question_id integer NOT NULL,
        option_format text COLLATE pg_catalog."default",
        CONSTRAINT options_pkey PRIMARY KEY (id),
        CONSTRAINT questions_fk FOREIGN KEY (question_id)
            REFERENCES public.questions (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )

CREATE TABLE IF NOT EXISTS public.student_tests
    (
        id integer NOT NULL DEFAULT nextval('student_tests_id_seq'::regclass),
        test_id integer NOT NULL,
        student_id integer NOT NULL,
        CONSTRAINT student_tests_pkey PRIMARY KEY (id),
        CONSTRAINT tests_fk FOREIGN KEY (test_id)
            REFERENCES public.tests (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        CONSTRAINT students_fk FOREIGN KEY (student_id)
            REFERENCES public.students (student_id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )

CREATE TABLE IF NOT EXISTS public.student_test_result
    (
        id integer NOT NULL DEFAULT nextval('student_test_result_id_seq'::regclass),
        status text COLLATE pg_catalog."default" NOT NULL,
        score text COLLATE pg_catalog."default" NOT NULL,
        student_test_id integer NOT NULL,
        CONSTRAINT student_test_result_pkey PRIMARY KEY (id),
        CONSTRAINT student_test_fk FOREIGN KEY (student_test_id)
            REFERENCES public.student_tests (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )

CREATE TABLE IF NOT EXISTS public.student_answers
    (
        id integer NOT NULL DEFAULT nextval('student_answers_id_seq'::regclass),
        student_test_id integer NOT NULL,
        question_id integer NOT NULL,
        student_answer text COLLATE pg_catalog."default",
        CONSTRAINT student_answers_pkey PRIMARY KEY (id),
        CONSTRAINT questions_fk FOREIGN KEY (question_id)
            REFERENCES public.questions (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        CONSTRAINT students_tests_fk FOREIGN KEY (student_test_id)
            REFERENCES public.student_tests (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )

CREATE TABLE IF NOT EXISTS public.students_exams_links
    (
        link_number integer NOT NULL DEFAULT nextval('students_exams_links_link_number_seq'::regclass),
        student_id text COLLATE pg_catalog."default" NOT NULL,
        random_chars text COLLATE pg_catalog."default" NOT NULL,
        bitrix_request text COLLATE pg_catalog."default" NOT NULL,
        exam_times integer DEFAULT 1,
        CONSTRAINT students_exams_links_pkey PRIMARY KEY (bitrix_request, student_id)
    )