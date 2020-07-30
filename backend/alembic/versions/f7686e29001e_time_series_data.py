"""time-series-data

Revision ID: f7686e29001e
Revises: 91a50206245d
Create Date: 2020-07-26 17:45:54.213150

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "f7686e29001e"
down_revision = "91a50206245d"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "time_series",
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=True),
        sa.Column("confirmed", sa.Integer(), nullable=True),
        sa.Column("recovered", sa.Integer(), nullable=True),
        sa.Column("deaths", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_time_series_id"), "time_series", ["id"], unique=False
    )
    op.create_table(
        "timeseries_ttl",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("last_updated", sa.DateTime(), nullable=True),
        sa.Column("time_to_live", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_timeseries_ttl_id"), "timeseries_ttl", ["id"], unique=False
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_timeseries_ttl_id"), table_name="timeseries_ttl")
    op.drop_table("timeseries_ttl")
    op.drop_index(op.f("ix_time_series_id"), table_name="time_series")
    op.drop_table("time_series")
    # ### end Alembic commands ###
