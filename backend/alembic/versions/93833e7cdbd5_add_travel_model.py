"""Add Travel model

Revision ID: 93833e7cdbd5
Revises: 8f83994fb19e
Create Date: 2020-06-04 13:33:37.553257

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "93833e7cdbd5"
down_revision = "8f83994fb19e"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "travels",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("story_id", sa.Integer(), nullable=True),
        sa.Column("location", sa.String(length=128), nullable=True),
        sa.Column("date_of_return", sa.Date(), nullable=True),
        sa.ForeignKeyConstraint(["story_id"], ["stories.id"],),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_travels_id"), "travels", ["id"], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_travels_id"), table_name="travels")
    op.drop_table("travels")
    # ### end Alembic commands ###